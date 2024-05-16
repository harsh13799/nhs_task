SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Patients](
	[PatientID] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](50) NULL,
	[Surname] [varchar](50) NULL,
	[DateOfBirth] [date] NULL,
	[Age] [int] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Patients] ADD PRIMARY KEY CLUSTERED 
(
	[PatientID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO


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
	[TotalScore] [int] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[PatientsResponse] ADD PRIMARY KEY CLUSTERED 
(
	[ResponseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[PatientsResponse]  WITH CHECK ADD FOREIGN KEY([PatientID])
REFERENCES [dbo].[Patients] ([PatientID])
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetAllPatientsDetails]
AS
SELECT * FROM Patients
GO;
GO


Server=localhost;Database=nhs;Trusted_Connection=True;Password=password

Dhruv\patel

NT Service\MSSQLSERVER


dev
password


CREATE PROCEDURE InsertPatientDataAndResponse
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
