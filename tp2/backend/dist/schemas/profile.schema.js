import yup from 'yup';
var ProfileStatus;
(function (ProfileStatus) {
    ProfileStatus["pending"] = "pending";
    ProfileStatus["active"] = "active";
    ProfileStatus["inactive"] = "inactive";
})(ProfileStatus || (ProfileStatus = {}));
var ProfileType;
(function (ProfileType) {
    ProfileType["user"] = "user";
    ProfileType["doc"] = "doc";
    ProfileType["admin"] = "admin";
})(ProfileType || (ProfileType = {}));
const profile = yup.object({
    accountId: yup.mixed().required(),
    name: yup.string().trim(),
    status: yup.mixed().oneOf([ProfileStatus.pending, ProfileStatus.active, ProfileStatus.inactive]).required(),
    restrictions: yup.string().trim(),
    preferences: yup.string().trim(),
    diners: yup.number().integer().positive(),
    docId: yup.mixed(),
    accountType: yup.mixed().oneOf([ProfileType.user, ProfileType.admin, ProfileType.doc]).required(),
});
const docProfile = yup.object({
    accountId: yup.mixed().required(),
    name: yup.string().trim(),
    status: yup.mixed().oneOf([ProfileStatus.pending, ProfileStatus.active, ProfileStatus.inactive]).required(),
    idDocument: yup.string().trim().required(),
    idLicense: yup.string().trim().required(),
    accountType: yup.mixed().oneOf([ProfileType.doc]).required(),
});
export { profile, docProfile, ProfileStatus, ProfileType };
