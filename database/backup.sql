IF DB_ID('Supermarket') IS NULL
BEGIN
  CREATE DATABASE Supermarket;
END
GO

USE Supermarket;
GO

IF OBJECT_ID('dbo.Products', 'U') IS NOT NULL DROP TABLE dbo.Products;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO

CREATE TABLE dbo.Users (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Email NVARCHAR(255) NOT NULL UNIQUE,
  PasswordHash NVARCHAR(255) NOT NULL,
  Name NVARCHAR(120) NOT NULL,
  CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.Products (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  UserId INT NOT NULL,
  Name NVARCHAR(150) NOT NULL,
  ImagePath NVARCHAR(255) NOT NULL,
  Price DECIMAL(10, 2) NOT NULL,
  Status NVARCHAR(30) NOT NULL,
  ExpirationDate DATE NULL,
  Description NVARCHAR(500) NULL,
  CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_Products_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id),
  CONSTRAINT CK_Products_Status CHECK (Status IN ('disponible', 'agotado', 'descontinuado')),
  CONSTRAINT CK_Products_Price CHECK (Price > 0)
);
GO

INSERT INTO dbo.Users (Email, PasswordHash, Name)
VALUES (
  N'demo@demo.com',
  N'$2b$10$YVzONl/D.W73k1ogpJ5evOx3rhs/WydpfzIhWk.aeVz8Tt1ccsZJm',
  N'Usuario Demo'
);

DECLARE @DemoId INT = SCOPE_IDENTITY();

INSERT INTO dbo.Products (UserId, Name, ImagePath, Price, Status, ExpirationDate, Description)
VALUES
  (@DemoId, N'Leche entera 1L', N'/uploads/leche.png', 8.50, N'disponible', DATEADD(DAY, 12, CAST(GETDATE() AS DATE)), N'Leche pasteurizada, mantener refrigerada.'),
  (@DemoId, N'Pan de molde', N'/uploads/pan.png', 12.90, N'disponible', DATEADD(DAY, 4, CAST(GETDATE() AS DATE)), N'Pan blanco, 500 g.'),
  (@DemoId, N'Detergente líquido', N'/uploads/detergente.png', 24.00, N'agotado', NULL, N'Producto de limpieza, no vence.');
GO
