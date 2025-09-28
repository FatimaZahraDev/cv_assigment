const api = {
  // Authentication endpoints
  signup: { method: "POST", url: "register/user" },
  login: { method: "POST", url: "login" },
  forgotPassword: { method: "POST", url: "forgot-password" },
  verifyOtp: { method: "POST", url: "verify-otp" },
  resetPassword: { method: "POST", url: "reset-password" },
  getProfile: { method: "GET", url: "profile" },
  updateProfile: { method: "POST", url: "update-profile" },
  changePassword: { method: "POST", url: "change-password" },

  // Event Endpoints
  createEvent: { method: "POST", url: "events" },
  getEvent: { method: "GET", url: "events" },
  updateEvent: { method: "PUT", url: "events" },
  deleteEvent: { method: "DELETE", url: "events" },
  getEventById: { method: "GET", url: "events" },

  // Vehicle Ad Endpoints (Private)
  createVehicle: { method: "POST", url: "vehicle-ads" },
  getMineVehicle: { method: "GET", url: "vehicle-ads" },
  updateVehicle: { method: "PUT", url: "vehicle-ads" },
  updateVehicleStatus: { method: "PATCH", url: "vehicle-ads" },
  deleteVehicleStatus: { method: "DELETE", url: "vehicle-ads" },

  // Vehicle Public Vehicle Endpoints
  getAllVehicle: { method: "GET", url: "public-vehicle-ads" },
  getVehicleById: { method: "GET", url: "vehicle-ads" },

  // Inspectors
  getInspectors: { method: "GET", url: "inspectors" },

  // Static Pages
  getTermsPage: { method: "GET", url: "pages/terms" },
  getPrivacyPage: { method: "GET", url: "pages/privacy" },
  getAboutPage: { method: "GET", url: "pages/about" },

  // Forum End Point
  createForum: { method: "POST", url: "forum/posts" },
  updateForum: { method: "PUT", url: "forum/posts" },
  getForum: { method: "GET", url: "forum/posts" },
  getTrendingForum: { method: "GET", url: "forum/trending" },
  getForumById: { method: "GET", url: "forum/posts" },
  deleteForum: { method: "DELETE", url: "forum/posts" },
  likeForum: { method: "POST", url: "forum/posts" },

  // Forum Comments End Points
  getForumComments: { method: "GET", url: "forum/posts" },
  createForumComment: { method: "POST", url: "forum/posts" },
  likeForumComment: { method: "POST", url: "comments" },
  replyToComment: { method: "POST", url: "forum/posts" },

  // Comment Reactions End Points
  addCommentReaction: { method: "POST", url: "forum/comments" },
  removeCommentReaction: { method: "DELETE", url: "forum/comments" },
  listCommentReactions: { method: "GET", url: "forum/comments" },

  //File Upload
  fileUpload: { method: "POST", url: "event-attachments/upload" },
  forumFileUpload: { method: "POST", url: "forum/attachments/upload" },
  vehicleFileUpload: { method: "POST", url: "vehicle-attachments/upload-temp" },
  allTypeFileUpload: { method: "POST", url: "upload-image" },

// Requests Endpoints
  createInpesctionRequest: { method: "POST", url: "inspection-requests" },
  requestToken: { method: "POST", url: "token-requests" },
  updateRequestToken: { method: "PUT", url: "token-requests" },
  getRequestToken: { method: "GET", url: "token-requests/to-me" },
  getInspectionRequest: { method: "GET", url: "inspection-requests" },
  deleteInspectionRequest: { method: "DELETE", url: "inspection-requests" },




  // Dropdowns
  alldropdowm: { method: "GET", url: "dropdowns/all" },
  getCategories: { method: "GET", url: "categories" },
 getSubcategoriesByCategory: { method: "GET", url: "subcategories/by-category" },
};

export default api;
