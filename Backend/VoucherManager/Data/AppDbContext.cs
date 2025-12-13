using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VoucherManager.Models;

namespace VoucherManager.Data;

public partial class AppDbContext : IdentityDbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<Voucher> Vouchers { get; set; }
    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasIndex(e => e.VoucherId, "IX_Orders_VoucherId");

            entity.Property(e => e.Item).HasMaxLength(30);

            entity.HasOne(d => d.Voucher).WithMany(p => p.Orders).HasForeignKey(d => d.VoucherId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Voucher>(entity =>
        {
            entity.Property(e => e.Customer).HasMaxLength(30);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
