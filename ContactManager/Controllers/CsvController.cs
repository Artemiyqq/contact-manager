using ContactManager.Data;
using ContactManager.Models;
using CsvHelper;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace ContactManager.Controllers
{
    [Route("contacts-manager")]
    [ApiController]
    public class CsvController(CsvDbContext context) : ControllerBase
    {
        private readonly CsvDbContext _context = context;

        [HttpGet("get")]
        public IActionResult Get()
        {
            return Ok(_context.Contacts.ToList());
        }

        [HttpPost("post-csv")]
        public IActionResult Post(IFormFile file)
        {
            if (file == null || file.Length == 0 || file.ContentType != "text/csv")
            {
                return BadRequest("Missing or invalid file");
            }

            try
            {
                using (var stream = new StreamReader(file.OpenReadStream()))
                {
                    var csvReader = new CsvReader(stream, CultureInfo.InvariantCulture);
                    var contacts = csvReader.GetRecords<ContactDto>();

                    _context.Contacts.AddRange(contacts.Select(c => new Contact
                    {
                        Name = c.Name,
                        DateOfBirth = c.DateOfBirth,
                        Married = c.Married,
                        Phone = c.Phone,
                        Salary = c.Salary
                    }));

                    _context.SaveChanges();
                }

                return Ok(new { message = "File uploaded successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing the CSV file: " + ex.Message);
            }
        }

        [HttpPut("put/{id}")]
        public IActionResult Put(int id, [FromBody] ContactDto contactDto)
        {
            var contact = _context.Contacts.Find(id);

            if (contact == null)
            {
                return NotFound(new { message = "Contact not found" });
            }

            contact.Name = contactDto.Name;
            contact.DateOfBirth = contactDto.DateOfBirth;
            contact.Married = contactDto.Married;
            contact.Phone = contactDto.Phone;
            contact.Salary = contactDto.Salary;

            _context.SaveChanges();

            return Ok(new { message = "Contact updated successfully" });
        }

        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            var contact = _context.Contacts.Find(id);

            if (contact == null)
            {
                return NotFound(new { message = "Contact not found" });
            }
            _context.Contacts.Remove(contact);

            _context.SaveChanges();

            return Ok(new { message = "Contact deleted successfully" });
        }
    }
}