using ContactManager.Models;
using Microsoft.EntityFrameworkCore;

namespace ContactManager.Data
{
    public class CsvDbContext(DbContextOptions<CsvDbContext> options) : DbContext(options)
    {
        public DbSet<Contact> Contacts => Set<Contact>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Contact>()
                .ToTable("Contacts")
                .HasKey(c => c.Id);

            modelBuilder.Entity<Contact>()
                .Property(c => c.Salary)
                .HasPrecision(18, 2);
        }
    }
}