using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleDrive.App.DataTransferObjects;
using SimpleDrive.App.Extensions;
using SimpleDrive.DAL;
using SimpleDrive.DAL.Interfaces;
using SimpleDrive.DAL.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SimpleDrive.App.Controllers
{
    [Route("api/[controller]")]
    public class FilesController : Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public FilesController(
            ApplicationDbContext dbContext,
            IFileService fileService,
            IMapper mapper)
        {
            _dbContext = dbContext;
            _fileService = fileService;
            _mapper = mapper;
        }

        // GET api/<controller>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var result = _dbContext.Files
                .AsNoTracking()
                .ProjectTo<FileGridInfo>(_mapper.ConfigurationProvider);

            return Ok(result);
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var file = await _dbContext.Files.AsNoTracking().FirstOrDefaultAsync(f => f.Id == id);
            if (file == null)
            {
                return BadRequest();
            }

            return File(file.Path, file.ContentType, file.Name);
        }

        // POST api/<controller>
        [HttpPost]
        public async Task<ActionResult> Post(List<IFormFile> files)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            
            // TODO: add transaction
            foreach (var file in files)
            {
                if (file.Length <= 0)
                {
                    continue;
                }
                
                string path = _fileService.GenerateUniquePath();
                using (var stream = file.OpenReadStream())
                {
                    await _fileService.AddUpdateAsync(path, stream);
                }

                var now = DateTime.UtcNow;
                await _dbContext.Files.AddAsync(new File()
                {
                    Name = file.GetFileName(),
                    ContentType = file.ContentType,
                    Path = path,
                    OwnerId = User.GetId(),
                    CreatedTimestamp = now,
                    UpdatedTimestamp = now
                });
            }

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, IFormFile file)
        {
            var entry = await _dbContext.Files.FirstOrDefaultAsync(f => f.Id == id);
            if (entry == null || !ModelState.IsValid || file.Length <= 0)
            {
                return BadRequest();
            }

            // TODO: add transaction
            using (var stream = file.OpenReadStream())
            {
                await _fileService.AddUpdateAsync(entry.Path, stream);
            }

            entry.Name = file.GetFileName();
            entry.ContentType = file.ContentType;
            entry.OwnerId = User.GetId();
            entry.UpdatedTimestamp = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var file = await _dbContext.Files.FirstOrDefaultAsync(f => f.Id == id);
            if (file == null)
            {
                return BadRequest();
            }

            await _fileService.Remove(file.Path);
            _dbContext.Files.Remove(file);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
    }
}
