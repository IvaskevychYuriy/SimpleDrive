using AutoMapper;
using SimpleDrive.App.DataTransferObjects;
using SimpleDrive.DAL.Models;

namespace SimpleDrive.App.MappingProfiles
{
    public class DtosMappingProfile : Profile
    {
        public DtosMappingProfile()
        {
            // maps models to dtos
            CreateMap<User, UserProfileDTO>();

            CreateMap<File, FileGridInfo>()
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.Owner.UserName));



            // maps dtos to models
        }
    }
}
