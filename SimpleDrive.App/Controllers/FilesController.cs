using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SimpleDrive.App.DataTransferObjects;
using SimpleDrive.App.Extensions;
using SimpleDrive.App.Options;
using SimpleDrive.DAL;
using SimpleDrive.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
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

        // GET api/<controller>
        [Authorize]
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var result = _dbContext.Files
                .AsNoTracking()
                .ProjectTo<FileGridInfo>(_mapper.ConfigurationProvider);

            return Ok(result);
        }

        // GET api/<controller>/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var file = await _dbContext.Files.AsNoTracking().FirstOrDefaultAsync(f => f.Id == id);
            if (file == null)
            {
                return BadRequest();
            }

            var stream = _fileService.OpenStream(GetFullPath(file.Path));
            return File(stream, file.ContentType, file.Name);
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
            foreach (var file in files)
            {
                if (file == null || file.Length <= 0)
                {
                    continue;
                }
                
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
            var entry = await _dbContext.Files.FirstOrDefaultAsync(f => f.Id == id);
            if (entry == null || !ModelState.IsValid || file == null || file.Length <= 0)
            {
                return BadRequest();
            }

            // TODO: add transaction
            using (var stream = file.OpenReadStream())
            {
                await _fileService.AddUpdateAsync(GetFullPath(entry.Path), stream);
            }

            entry.Name = file.GetFileName();
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
            var file = await _dbContext.Files.FirstOrDefaultAsync(f => f.Id == id);
            if (file == null)
            {
                return BadRequest();
            }

            await _fileService.Remove(GetFullPath(file.Path));
            _dbContext.Files.Remove(file);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        private string GetFullPath(string path)
        {
            return Path.Combine(_fsOptions.StoreDirectory, path);
        }
    }
}
