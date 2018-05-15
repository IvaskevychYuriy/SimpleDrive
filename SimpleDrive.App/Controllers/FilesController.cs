using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SimpleDrive.App.DataTransferObjects;
using SimpleDrive.App.Extensions;
using SimpleDrive.App.IntermediateModels;
using SimpleDrive.App.Options;
using SimpleDrive.App.Models;
using SimpleDrive.DAL;
using SimpleDrive.DAL.Enumerations;
using SimpleDrive.DAL.Interfaces;
using SimpleDrive.DAL.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleDrive.App.Controllers
{
    [Route("api/[controller]")]
    public class FilesController : Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;
        private readonly FileSystemOptions _fsOptions;

        public FilesController(
            ApplicationDbContext dbContext,
            IFileService fileService,
            IMapper mapper,
            IOptions<FileSystemOptions> fsOptions)
        {
            _dbContext = dbContext;
            _fileService = fileService;
            _mapper = mapper;
            _fsOptions = fsOptions.Value;
        }
        
        // GET api/<controller>/public
        [HttpGet("public")]
        public async Task<ActionResult> GetPublic()
        {
            var result = _dbContext.Files
                .AsNoTracking()
                .Where(f => f.IsPubliclyVisible)
                .ProjectTo<FileGridInfo>(_mapper.ConfigurationProvider);

            return Ok(result);
        }

        // GET api/<controller>/personal
        [Authorize]
        [HttpGet("personal")]
        public async Task<ActionResult> GetPersonal()
        {
            int userId = User.GetId();
            var result = await _dbContext.Files
                .AsNoTracking()
                .Where(f => f.OwnerId == userId)
                .ProjectTo<FileGridInfo>(_mapper.ConfigurationProvider)
                .ToListAsync();

            foreach (var dto in result)
            {
                dto.IsOwner = true;
            }

            return Ok(result);
        }

        // GET api/<controller>/shared
        [Authorize]
        [HttpGet("shared")]
        public async Task<ActionResult> GetShared()
        {
            int userId = User.GetId();
            var result = await _dbContext.Files
                .AsNoTracking()
                .Include(f => f.ResourcePermissions)
                .Where(f => f.ResourcePermissions.Any(p => p.UserId == userId))
                .ProjectTo<FileGridInfoEx>(_mapper.ConfigurationProvider)
                .ToListAsync();

            foreach (var dto in result)
            {
                dto.IsOwner = false;
                dto.Permission = dto.ResourcePermissions.FirstOrDefault(p => p.UserId == userId)?.PermissionId;
            }

            return Ok(_mapper.Map<List<FileGridInfo>>(result));
        }

        // GET api/<controller>/all
        [Authorize(Roles = Constants.RoleNames.AdminRoleName)]
        [HttpGet("all")]
        public async Task<ActionResult> GetAll()
        {
            int userId = User.GetId();
            var result = await _dbContext.Files
                .AsNoTracking()
                .ProjectTo<FileGridInfoEx>(_mapper.ConfigurationProvider)
                .ToListAsync();

            foreach (var dto in result)
            {
                dto.IsOwner = dto.OwnerId == userId;
                dto.Permission = Permissions.Full;
            }

            return Ok(_mapper.Map<List<FileGridInfo>>(result));
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var file = await _dbContext.Files
                .AsNoTracking()
                .Include(f => f.ResourcePermissions)
                .FirstOrDefaultAsync(f => f.Id == id);
            if (file == null)
            {
                return BadRequest();
            }

            var stream = _fileService.OpenStream(GetFullPath(file.Path));
            return File(stream, file.ContentType, file.Name);
        }

        // GET api/<controller>/abcd/share?p=1
        [Authorize]
        [HttpGet("{path}/share")]
        public async Task<ActionResult> Share(string path, [FromQuery(Name = "p")]Permissions permission)
        {
            int userId = User.GetId();
            var file = await _dbContext.Files
                .Include(f => f.ResourcePermissions)
                .FirstOrDefaultAsync(f => f.Path == path);
            if (file == null)
            {
                return BadRequest();
            }

            if (file.OwnerId == userId)
            {
                // an owner already has permissions
                return Ok();
            }

            var resourcePermission = file.ResourcePermissions.FirstOrDefault(p => p.UserId == userId);
            if (resourcePermission != null)
            {
                // either update existing
                resourcePermission.PermissionId = permission;
            }
            else
            {
                // or add a new one
                file.ResourcePermissions.Add(new ResourcePermission()
                {
                    FileId = file.Id,
                    UserId = userId,
                    PermissionId = permission
                });
            }

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        // GET api/<controller>/5/shareLink?p=1
        [Authorize]
        [HttpGet("{id}/shareLink")]
        public async Task<ActionResult> ShareLink(int id, [FromQuery(Name = "p")]Permissions permission)
        {
            int userId = User.GetId();
            var file = await _dbContext.Files
                .AsNoTracking()
                .Include(f => f.ResourcePermissions)
                .FirstOrDefaultAsync(f => f.Id == id);
            if (file == null)
            {
                return BadRequest();
            }

            if (!HasPermission(file, Permissions.Full))
            {
                return Unauthorized();
            }

            return Ok(file.Path);
        }
        
        // POST api/<controller>/sharing
        [HttpPost("sharing")]
        public async Task<ActionResult> SharingOptions([FromBody] FileShareModel model)
        {
            if (!ModelState.IsValid || model == null)
            {
                return BadRequest();
            }

            var file = await _dbContext.Files
                .Include(f => f.ResourcePermissions)
                .FirstOrDefaultAsync(f => f.Id == model.FileId);
            if (file == null)
            {
                return BadRequest();
            }

            if (!HasPermission(file, Permissions.Full))
            {
                return Unauthorized();
            }

            file.IsPubliclyVisible = model.IsPubliclyVisible;
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        // POST api/<controller>
        [Authorize]
        [HttpPost]
        public async Task<ActionResult> Post(List<IFormFile> files)
        {
            if (files == null || !ModelState.IsValid)
            {
                return BadRequest();
            }

            // TODO: add transaction
            var now = DateTime.UtcNow;
            int userId = User.GetId();

            if (!User.IsInRole(Constants.RoleNames.AdminRoleName))
            {
                var quotaInfo = GetQuotaInfo(userId);
                long additional = files.Sum(x => x.Length);
                long? difference = quotaInfo.Difference(additional);

                if (difference < 0)
                {
                    return BadRequest($"Exceeded allowed quota of {quotaInfo.QuotaAllowed} by {-difference} bytes");
                }
            }

            foreach (var file in files)
            {
                string path = _fileService.GenerateUniquePath();
                using (var stream = file.OpenReadStream())
                {
                    await _fileService.AddUpdateAsync(GetFullPath(path), stream);
                }

                await _dbContext.Files.AddAsync(new DAL.Models.File()
                {
                    Name = file.GetFileName(),
                    ContentType = file.ContentType,
                    Path = path,
                    Length = file.Length,
                    OwnerId = userId,
                    CreatedTimestamp = now,
                    UpdatedTimestamp = now
                });
            }

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        // PUT api/<controller>/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, IFormFile file)
        {
            var entry = await _dbContext.Files
                .Include(f => f.ResourcePermissions)
                .FirstOrDefaultAsync(f => f.Id == id);
            if (entry == null || !ModelState.IsValid || file == null || file.Length <= 0)
            {
                return BadRequest();
            }

            if (!HasPermission(entry, Permissions.Write))
            {
                return Unauthorized();
            }

            if (!User.IsInRole(Constants.RoleNames.AdminRoleName))
            {
                var quotaInfo = GetQuotaInfo(User.GetId());
                long? difference = quotaInfo.Difference(file.Length);

                if (difference < 0)
                {
                    return BadRequest($"Exceeded allowed quota of {quotaInfo.QuotaAllowed} by {-difference} bytes");
                }
            }

            // TODO: add transaction
            using (var stream = file.OpenReadStream())
            {
                await _fileService.AddUpdateAsync(GetFullPath(entry.Path), stream);
            }

            entry.Name = file.GetFileName();
            entry.Length = file.Length;
            entry.ContentType = file.ContentType;
            entry.OwnerId = User.GetId();
            entry.UpdatedTimestamp = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        // DELETE api/<controller>/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var file = await _dbContext.Files
                .Include(f => f.ResourcePermissions)
                .FirstOrDefaultAsync(f => f.Id == id);
            if (file == null)
            {
                return BadRequest();
            }

            if (!HasPermission(file, Permissions.Full))
            {
                return Unauthorized();
            }

            await _fileService.Remove(GetFullPath(file.Path));
            _dbContext.Files.Remove(file);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        private QuotaInfo GetQuotaInfo(int userId)
        {
            return _dbContext.Users
                .Where(u => u.Id == userId)
                .Select(u => new QuotaInfo
                {
                    QuotaAllowed = u.QuotaAllowed,
                    QuotaUsed = u.Files.Sum(f => f.Length)
                })
                .Single();
        }

        private string GetFullPath(string path)
        {
            return Path.Combine(_fsOptions.StoreDirectory, path);
        }

        private bool HasPermission(DAL.Models.File file, Permissions? permission = null)
        {
            int userId = User.GetId();
            return User.IsInRole(Constants.RoleNames.AdminRoleName)
                || file.OwnerId == userId
                || file.ResourcePermissions.Any(p => p.UserId == userId && (permission == null || p.PermissionId >= permission));
        }
    }
}
