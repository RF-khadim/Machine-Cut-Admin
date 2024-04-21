/* eslint-disable import/no-anonymous-default-export */
import BaseService from "./baseService";

class ApiService extends BaseService {
  // Auth Routes
  login(data) {
    return this.post("/login", data);
  }
  forgotPassword(data) {
    return this.post("/forgot_password", data);
  }
  register(data) {
    return this.post("/register", data);
  }
  addMaterial(data) {
    return this.post("/product", data);
  }
  updateMaterial(data, _id) {
    return this.put(`/product/${_id}`, data);
  }
  deleteMaterial(_, _id) {
    return this.delete(`/product/${_id}`);
  }
  getMaterials() {
    return this.get("/product");
  }
  addCategory(data) {
    return this.post("/category", data);
  }
  updateCategory(data, _id) {
    return this.put(`/category/${_id}`, data);
  }
  deleteCategory(data) {
    return this.delete(`/category/${data?._id}`);
  }
  getCategoriesWithoutParents() {

    return this.get("/category");
  }
  getCategories(id) {
    return this.get(`/category/parents?product=${id}`);
  }
  getCategory(id) {
    return this.get(`/category/${id}`);
  }
  getUsers() {
    return this.get('/user')
  }
  addUser(data) {
    return this.post('/register', data)
  }
  updateUser(data, id) {
    return this.put(`/user/${id}`, data)
  }
  updateParticularUser(data, id) {
    return this.put(`/profile/${id}`, data)
  }
  deleteProfile(data) {
    return this.delete(`/profile/${data?._id}`)
  }
  updateOwnProfile(data) {
    return this.put(`/profile/update`, data)
  }
  updateProfile(data) {
    return this.put(`/profile/update`, data)
  }
  updateOneProfile(data,id) {
    return this.put(`/profile/${id}`, data)
  }
  deleteUser(id) {
    return this.delete(`/user/${id}`)
  }
  deleteParticularUser(id) {
    return this.delete(`/profile/${id}`)
  }
  getOwnProfile() {
    return this.get('/profile/ownProfile')
  }
  addVariant(data) {
    return this.post("/variant", data)
  }
  getVariants() {
    return this.get("/variant")
  }
  getVariant(id) {
    return this.get(`/variant/${id}`)
  }
  updateVariant(data) {
    return this.put(`/variant/${data?._id}`, data)
  }
  addVariantValues(data) {
    return this.put(`/variant/values/${data?._id}`, data)
  }
  updateVariantValues(data) {
    return this.put(`/variant/updateValues/${data?._id}`, data)
  }
  deleteVariantValue(data) {
    return this.put(`/variant/deleteValues/${data?._id}`, data)
  }
  deleteVariant(data) {
    return this.delete(`/variant/${data?._id}`)
  }
  addInventory(data) {
    return this.post("/inventory", data)
  }
  deleteInventory(data) {
    return this.delete(`/inventory/${data?._id}`)
  }
  getInventories() {
    return this.get("/inventory")
  }
  getInventory(data) {
    return this.get(`/inventory/${data?._id}`)
  }
  updateInventory(data) {
    return this.put(`/inventory/${data?._id}`, data)
  }
  searchByBatchCode(data) {
    return this.post("/inventory/search_by_batch_code", data)
  }
  addMachine(data) {
    return this.post("/machine", data)
  }
  updateMachine(data,id) {
    return this.put(`/machine/${id}`, data)
  }
  addFirmwareIntoMachine(data, id) {
    return this.put(`/machine/addFirmware/${id}`, data)
  }
  getMachines() {
    return this.get("/machine")
  }
  getMachinesWithoutSerialNumber() {
    return this.get("/machine/withoutSerialNumber")
  }
  getMachine(id) {
    return this.get(`/machine/${id}`)
  }
  deletMachine(data) {
    return this.delete(`/machine/${data?._id}`)
  }
  getProfiles() {
    return this.get("/profile")
  }
  getProfile(id) {
    console.log("id",id)
    return this.get(`/profile/${id}`)
  }
  getManufacturer(id){
    return this.get(`/manufacturer/${id}`)
  }
  getManufacturers(){
    return this.get(`/manufacturer/`)
  }
  addManufacturer(data){
    return this.post(`/manufacturer/`,data)
  }
  updateManufacturer(data,id){
    return this.put(`/manufacturer/${id}`,data)
  }
  deleteManufacturer(data){
    return this.delete(`/manufacturer/${data?._id}`)
  }
}

export default new ApiService();
