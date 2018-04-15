using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleDrive.DAL;
using System.Threading.Tasks;

namespace SimpleDrive.App.Controllers
{
    [Route("api/[controller]")]
    public class FilesController : Controller
    {
        private readonly ApplicationDbContext _dbContext;

        public FilesController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var file = await _dbContext.Files.FirstOrDefaultAsync(f => f.Id == id);
            if (file == null)
            {
                return BadRequest();
            }

            return File(file.Path, file.ContentType, file.Name);
        }

        // POST api/<controller>
        //[HttpPost]
        //public async Task<ActionResult> Post([FromBody]string value)
        //{
        //}

        //// PUT api/<controller>/5
        //[HttpPut("{id}")]
        //public async Task<ActionResult> Put(int id, [FromBody]string value)
        //{
        //}

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var file = await _dbContext.Files.FirstOrDefaultAsync(f => f.Id == id);
            if (file == null)
            {
                return BadRequest();
            }

            _dbContext.Files.Remove(file);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
    }
}
