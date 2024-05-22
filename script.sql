-- DATABASE CRATION STARTS

USE [master]
GO

/****** Object:  Database [nhs]    Script Date: 16-05-2024 16:25:25 ******/
CREATE DATABASE [nhs];

-- DATABASE CRATION ENDS
-- Patients TABLE CRATION STARTS

USE [nhs]
GO

/****** Object:  Table [dbo].[Patients]    Script Date: 16-05-2024 16:24:06 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Patients](
	[PatientID] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](50) NULL,
	[Surname] [varchar](50) NULL,
	[DateOfBirth] [date] NULL,
	[Age] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[PatientID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Patients TABLE CRATION ENDS
-- PatientsResponse TABLE CRATION STARTS

USE [nhs]
GO

/****** Object:  Table [dbo].[PatientsResponse]    Script Date: 16-05-2024 16:25:06 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[PatientsResponse](
	[ResponseID] [int] IDENTITY(1,1) NOT NULL,
	[PatientID] [int] NULL,
	[DateSubmitted] [datetime] NULL,
	[ReliefScore] [int] NULL,
	[WorstPain] [int] NULL,
	[LeastPain] [int] NULL,
	[AveragePain] [int] NULL,
	[CurrentPain] [int] NULL,
	[GeneralActivity] [int] NULL,
	[Mood] [int] NULL,
	[WalkingAbility] [int] NULL,
	[NormalWork] [int] NULL,
	[Relationships] [int] NULL,
	[Sleep] [int] NULL,
	[EnjoymentOfLife] [int] NULL,
	[TotalScore] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ResponseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[PatientsResponse]  WITH CHECK ADD FOREIGN KEY([PatientID])
REFERENCES [dbo].[Patients] ([PatientID])
GO

-- PatientsResponse TABLE CRATION ENDS
-- GetAllPatientsDetails SP CRATION STARTS

USE [nhs]
GO

/****** Object:  StoredProcedure [dbo].[GetAllPatientsDetails]    Script Date: 16-05-2024 16:29:06 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetAllPatientsDetails]
AS
SELECT * FROM Patients
GO;
GO

-- GetAllPatientsDetails SP CRATION ENDS
-- InsertPatientDataAndResponse SP CRATION STARTS

USE [nhs]
GO

/****** Object:  StoredProcedure [dbo].[InsertPatientDataAndResponse]    Script Date: 16-05-2024 16:29:40 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[InsertPatientDataAndResponse]
    @FirstName VARCHAR(50),
    @Surname VARCHAR(50),
    @DateOfBirth DATE,
    @Age INT,
    @DateSubmitted DATETIME,
    @ReliefScore INT,
    @WorstPain INT,
    @LeastPain INT,
    @AveragePain INT,
    @CurrentPain INT,
    @GeneralActivity INT,
    @Mood INT,
    @WalkingAbility INT,
    @NormalWork INT,
    @Relationships INT,
    @Sleep INT,
    @EnjoymentOfLife INT,
    @TotalScore INT
AS
BEGIN
    SET NOCOUNT ON;
	-- 0 indicates unsuccessful by default
	-- 1 indicates successful
	DECLARE @Status INT = 0;
	DECLARE @Message NVARCHAR(1000) = 'Unsuccessful';
    DECLARE @PatientID INT;
    
    BEGIN TRY
        -- Insert data into Patients table
        INSERT INTO Patients (FirstName, Surname, DateOfBirth, Age)
        VALUES (@FirstName, @Surname, @DateOfBirth, @Age);

        -- Get the PatientID of the inserted patient
        SET @PatientID = SCOPE_IDENTITY();

        -- Insert data into PatientsResponse table
        INSERT INTO PatientsResponse (PatientID, DateSubmitted, ReliefScore, WorstPain, LeastPain, AveragePain, CurrentPain, GeneralActivity, Mood, WalkingAbility, NormalWork, Relationships, Sleep, EnjoymentOfLife, TotalScore)
        VALUES (@PatientID, @DateSubmitted, @ReliefScore, @WorstPain, @LeastPain, @AveragePain, @CurrentPain, @GeneralActivity, @Mood, @WalkingAbility, @NormalWork, @Relationships, @Sleep, @EnjoymentOfLife, @TotalScore);

        SET @Status = 1;
        SET @Message = 'Data inserted successfully.';
    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE();
    END CATCH

	-- Return response in JSON format
    SELECT 
        @Status AS [status],
        @Message AS [message]
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
END;
GO

-- InsertPatientDataAndResponse SP CRATION ENDS
-- UpdatePatientDataAndResponse SP CRATION STARTS

USE [nhs]
GO

/****** Object:  StoredProcedure [dbo].[UpdatePatientDataAndResponse]    Script Date: 16-05-2024 07:38:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[UpdatePatientDataAndResponse]
    @FirstName VARCHAR(50),
    @Surname VARCHAR(50),
    @DateOfBirth DATE,
    @Age INT,
    @DateSubmitted DATETIME,
    @ReliefScore INT,
    @WorstPain INT,
    @LeastPain INT,
    @AveragePain INT,
    @CurrentPain INT,
    @GeneralActivity INT,
    @Mood INT,
    @WalkingAbility INT,
    @NormalWork INT,
    @Relationships INT,
    @Sleep INT,
    @EnjoymentOfLife INT,
    @TotalScore INT,
    @PatientID INT
AS
BEGIN
    SET NOCOUNT ON;
	-- 0 indicates unsuccessful by default
	-- 1 indicates successful
	DECLARE @Status INT = 0;
	DECLARE @Message NVARCHAR(1000) = 'Unsuccessful';
    
    BEGIN TRY
        -- Update data in Patients table
        UPDATE Patients
        SET FirstName = @FirstName,
            Surname = @Surname,
            DateOfBirth = @DateOfBirth,
            Age = @Age
        WHERE PatientID = @PatientID;

        -- Update data in PatientsResponse table
        UPDATE PatientsResponse
        SET DateSubmitted = @DateSubmitted,
            ReliefScore = @ReliefScore,
            WorstPain = @WorstPain,
            LeastPain = @LeastPain,
            AveragePain = @AveragePain,
            CurrentPain = @CurrentPain,
            GeneralActivity = @GeneralActivity,
            Mood = @Mood,
            WalkingAbility = @WalkingAbility,
            NormalWork = @NormalWork,
            Relationships = @Relationships,
            Sleep = @Sleep,
            EnjoymentOfLife = @EnjoymentOfLife,
            TotalScore = @TotalScore
        WHERE PatientID = @PatientID;

        SET @Status = 1;
        SET @Message = 'Data updated successfully.';
    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE();
    END CATCH

	-- Return response in JSON format
    SELECT 
        @Status AS [status],
        @Message AS [message]
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
END;

-- UpdatePatientDataAndResponse SP CRATION END