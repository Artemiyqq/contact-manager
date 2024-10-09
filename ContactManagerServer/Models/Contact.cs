namespace ContactManagerServer.Models
{
    public class Contact
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public  DateOnly DateOfBirth { get; set; }
        public bool Married { get; set; }
        public required string Phone { get; set; }
        public decimal Salary { get; set; }
    }
}