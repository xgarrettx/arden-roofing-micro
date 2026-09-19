import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator'
import { LeadSource } from '../entities/lead.entity'

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  first_name: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  last_name?: string

  @IsEmail()
  @MaxLength(255)
  email: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9+()\-.\s]{7,20}$/, { message: 'phone must be a valid phone number' })
  phone: string

  @IsOptional()
  @IsString()
  @MaxLength(120)
  service?: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string

  @IsEnum(LeadSource)
  source: LeadSource

  @IsOptional()
  @IsString()
  @MaxLength(255)
  source_page?: string
}
