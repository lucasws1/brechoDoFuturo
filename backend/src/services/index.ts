// User service
export {
  createUser,
  authenticateUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  getUserOrders as getUserOrdersFromUserService,
} from "./user.service";

// Product service
export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsBySeller,
  updateProductStatus,
} from "./product.service";

// Order service
export {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getUserOrders as getUserOrdersFromOrderService,
  getOrderSalesStats,
} from "./order.service";

// Category service
export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} from "./category.service";

// Cart service
export {
  getCartByUserId,
  getOrCreateCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  calculateCartTotal,
  removeUnavailableItems,
  convertCartToOrder,
} from "./cart.service";

// Product Review service
export {
  createProductReview,
  getProductReviews,
  getUserReviews,
  getProductReviewById,
  updateProductReview,
  deleteProductReview,
  getProductReviewStats,
  getAllReviews,
} from "./productReview.service";
