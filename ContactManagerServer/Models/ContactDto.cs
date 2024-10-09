using CsvHelper.Configuration.Attributes;
using System.ComponentModel.DataAnnotations;

namespace ContactManagerServer.Models
{
    public class ContactDto
    {
        [Required]
        [DataType(DataType.Text)]
        [StringLength(100, MinimumLength = 3)]
        public required string Name { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [Name("Date of Birth")]
        public DateOnly DateOfBirth { get; set; }

        [Required]
        public bool Married { get; set; }

        [Required]
        [DataType(DataType.PhoneNumber)]
        public required string Phone { get; set; }
        public decimal Salary { get; set; }
    }
}