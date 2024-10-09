using Microsoft.AspNetCore.Mvc;

namespace ContactManagerServer.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
