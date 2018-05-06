using AutoMapper;
using SimpleDrive.App.DataTransferObjects;
using SimpleDrive.App.IntermediateModels;
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
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.Owner.UserName))
                .ForMember(dest => dest.Permission, opt => opt.Ignore())
                .ForMember(dest => dest.IsOwner, opt => opt.Ignore());

            CreateMap<File, FileGridInfoEx>()
                .IncludeBase<File, FileGridInfo>();

            CreateMap<FileGridInfoEx, FileGridInfo>();
            

            // maps dtos to models
        }
    }
}
