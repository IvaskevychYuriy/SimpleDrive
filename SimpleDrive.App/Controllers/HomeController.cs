using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SimpleDrive.App.Constants;
using SimpleDrive.App.DataTransferObjects;
using SimpleDrive.DAL.Models;
using System.Diagnostics;
using System.Threading.Tasks;

namespace SimpleDrive.App.Controllers
{
    public class HomeController : Controller
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public HomeController(
            SignInManager<User> signInManager,
            UserManager<User> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        // GET: /Home/Index
        public IActionResult Index()
        {
            return View();
        }

        // GET: /Home/Error
        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }

        // POST: /Home/Register
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginInfoDTO model)
        {
            if (ModelState.IsValid)
            {
                var user = new User { UserName = model.Email, Email = model.Email };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRolesAsync(user, new[] { RoleNames.UserRoleName });
                    return await AuthorizeResultAsync(model, StatusCodes.Status200OK);
                }
            }

            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        // POST: /Home/Login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginInfoDTO model)
        {
            if (ModelState.IsValid)
            {
                return await AuthorizeResultAsync(model, StatusCodes.Status200OK);
            }

            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        // POST: /Home/Logout
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        private async Task<IActionResult> AuthorizeResultAsync(LoginInfoDTO model, int code)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
            {
                var result = await _signInManager.PasswordSignInAsync(user, model.Password, model.RememberMe, true);
                if (result.Succeeded)
                {
                    return StatusCode(code, MapToProfile(user));
                }
            }

            return Unauthorized();
        }

        private UserProfileDTO MapToProfile(User user)
        {
            return new UserProfileDTO()
            {
                Email = user.Email,
                UserName = user.UserName
            };
        }
    }
}
