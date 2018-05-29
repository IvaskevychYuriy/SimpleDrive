using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SimpleDrive.App.Constants;
using SimpleDrive.App.DataTransferObjects;
using SimpleDrive.DAL;
using SimpleDrive.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleDrive.App.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public UsersController(
            ApplicationDbContext dbContext,
            UserManager<User> userManager,
            IMapper mapper)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _mapper = mapper;
        }

        // PUT api/<controller>
        [Authorize(Roles = RoleNames.AdminRoleName)]
        [HttpPut()]
        public async Task<ActionResult> ChangeQuota([FromBody] UserUpdateDTO model)
        {
            var user = await _dbContext.Users.FindAsync(model?.Id);
            if (user == null)
            {
                return BadRequest($"User with id = '{model?.Id}' was not found");
            }

            _mapper.Map(model, user);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        // GET api/<controller>
        [Authorize(Roles = RoleNames.AdminRoleName)]
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var users = await _userManager.GetUsersInRoleAsync(RoleNames.UserRoleName);
            var admins = await _userManager.GetUsersInRoleAsync(RoleNames.AdminRoleName);

            users = users.Where(u => !admins.Any(a => a.Id == u.Id)).ToList();
            return Ok(_mapper.Map<List<UserDTO>>(users));
        }

        // GET api/<controller>
        [Authorize(Roles = RoleNames.AdminRoleName)]
        [HttpGet("used")]
        public async Task<ActionResult> GetUsedSize(int age)
        {
            var usedSize = _dbContext.Users
                .Where(u => DateTime.UtcNow.Year - u.RegistrationYear <= age)
                .Sum(u => u.Files.Sum(f => f.Length));

            return Ok(usedSize);
        }

        // DELETE api/<controller>/5
        [Authorize(Roles = RoleNames.AdminRoleName)]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null || await _userManager.IsInRoleAsync(user, RoleNames.AdminRoleName))
            {
                return BadRequest();
            }

            await _userManager.DeleteAsync(user);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
    }
}
