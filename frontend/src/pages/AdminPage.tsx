import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import api from "../services/api";
import { ProductFormModal } from "../components/admin/ProductFormModal";
import { CategoryFormModal } from "../components/admin/CategoryFormModal";
import { ConfirmDeleteModal } from "../components/admin/ConfirmDeleteModal";

// Tipos
interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  revenue: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  status: "Available" | "Sold" | "Hidden";
  images: string[];
  stock: number;
  categories: { id: string; name: string }[];
}

interface User {
  id: string;
  name: string;
  email: string;
  type: "Admin" | "Customer";
  createdAt: string;
}

interface Order {
  id: string;
  total: number;
  status: "Pending" | "Paid" | "Shipped" | "Delivered" | "Cancelled";
  customer: { name: string; email: string };
  createdAt: string;
  items: number;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [deleteItem, setDeleteItem] = useState<{
    type: string;
    item: any;
  } | null>(null);

  // Verificar se é admin
  if (!isAuthenticated || user?.type !== "Admin") {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Carregar estatísticas do dashboard
      await Promise.all([
        loadStats(),
        loadProducts(),
        loadUsers(),
        loadOrders(),
        loadCategories(),
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados do admin:", error);
      toast.error("Erro ao carregar dados do painel");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Como não há endpoint específico, vamos calcular baseado nos dados
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        api.get("/products?limit=1000"),
        api.get("/users"),
        api.get("/orders"),
      ]);

      const totalProducts = productsRes.data.pagination?.total || 0;
      const totalUsers = usersRes.data.pagination?.total || 0;
      const totalOrders = ordersRes.data.pagination?.total || 0;
      const revenue =
        ordersRes.data.data?.reduce(
          (sum: number, order: any) => sum + order.total,
          0,
        ) || 0;

      setStats({
        totalProducts,
        totalUsers,
        totalOrders,
        revenue,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.get("/products?limit=100");
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  // Modal handlers
  const handleNewProduct = () => {
    setSelectedProduct(null);
    setProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteItem({ type: "product", item: product });
    setDeleteModalOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    // Navegar para a página do produto
    navigate(`/product/${product.id}`);
  };

  const handleNewCategory = () => {
    setSelectedCategory(null);
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryModalOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setDeleteItem({ type: "category", item: category });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;

    try {
      if (deleteItem.type === "product") {
        await api.delete(`/products/${deleteItem.item.id}`);
        toast.success("Produto excluído com sucesso!");
        loadProducts();
      } else if (deleteItem.type === "category") {
        await api.delete(`/categories/${deleteItem.item.id}`);
        toast.success("Categoria excluída com sucesso!");
        loadCategories();
      }
      setDeleteModalOpen(false);
      setDeleteItem(null);
    } catch (error: any) {
      console.error("Erro ao excluir:", error);
      toast.error(
        error.response?.data?.error?.message || "Erro ao excluir item",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="font-sans text-gray-600">Bem-vindo, {user?.name}</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Categorias
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Produtos
                </CardTitle>
                <Package className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalProducts || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Usuários
                </CardTitle>
                <Users className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalUsers || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Pedidos
                </CardTitle>
                <ShoppingCart className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalOrders || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Receita Total
                </CardTitle>
                <BarChart3 className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R${" "}
                  {(stats?.revenue || 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products && products.length > 0 ? (
                    products.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <img
                          src={product.images?.[0] || "/placeholder.jpg"}
                          alt={product.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            R${" "}
                            {product.price.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            product.status === "Available"
                              ? "bg-green-100 text-green-800"
                              : product.status === "Sold"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      {products
                        ? "Nenhum produto encontrado"
                        : "Carregando produtos..."}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pedidos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders && orders.length > 0 ? (
                    orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">
                            {order.customer?.name || "Cliente não encontrado"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.items} item(s) • R${" "}
                            {order.total.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "Cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      {orders
                        ? "Nenhum pedido encontrado"
                        : "Carregando pedidos..."}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
            <Button
              className="flex items-center gap-2"
              onClick={handleNewProduct}
            >
              <Plus className="h-4 w-4" />
              Novo Produto
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="p-4 text-left">Produto</th>
                      <th className="p-4 text-left">Preço</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Estoque</th>
                      <th className="p-4 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products && products.length > 0 ? (
                      products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images?.[0] || "/placeholder.jpg"}
                                alt={product.name}
                                className="h-12 w-12 rounded object-cover"
                              />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-600">
                                  {product.categories
                                    ?.map((cat) => cat.name)
                                    .join(", ") || "Sem categoria"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            R${" "}
                            {product.price.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="p-4">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                product.status === "Available"
                                  ? "bg-green-100 text-green-800"
                                  : product.status === "Sold"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {product.status}
                            </span>
                          </td>
                          <td className="p-4">{product.stock}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewProduct(product)}
                                title="Visualizar produto"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                title="Editar produto"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product)}
                                title="Excluir produto"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-4 text-center text-gray-500"
                        >
                          {products
                            ? "Nenhum produto encontrado"
                            : "Carregando produtos..."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="p-4 text-left">Nome</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Tipo</th>
                      <th className="p-4 text-left">Data de Cadastro</th>
                      <th className="p-4 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{user.name}</td>
                          <td className="p-4">{user.email}</td>
                          <td className="p-4">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                user.type === "Admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.type}
                            </span>
                          </td>
                          <td className="p-4">
                            {new Date(user.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-4 text-center text-gray-500"
                        >
                          {users
                            ? "Nenhum usuário encontrado"
                            : "Carregando usuários..."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gerenciar Pedidos</h2>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="p-4 text-left">ID</th>
                      <th className="p-4 text-left">Cliente</th>
                      <th className="p-4 text-left">Total</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Data</th>
                      <th className="p-4 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders && orders.length > 0 ? (
                      orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4 font-mono text-sm">
                            {order.id.slice(-8)}
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">
                                {order.customer?.name ||
                                  "Cliente não encontrado"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.customer?.email || ""}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            R${" "}
                            {order.total.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="p-4">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : order.status === "Cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {new Date(order.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-4 text-center text-gray-500"
                        >
                          {orders
                            ? "Nenhum pedido encontrado"
                            : "Carregando pedidos..."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
            <Button
              className="flex items-center gap-2"
              onClick={handleNewCategory}
            >
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="p-4 text-left">Nome</th>
                      <th className="p-4 text-left">Descrição</th>
                      <th className="p-4 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <tr
                          key={category.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4 font-medium">{category.name}</td>
                          <td className="p-4">{category.description || "-"}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCategory(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCategory(category)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-4 text-center text-gray-500"
                        >
                          {categories
                            ? "Nenhuma categoria encontrada"
                            : "Carregando categorias..."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSuccess={() => {
          loadProducts();
          loadStats();
        }}
        product={selectedProduct}
        categories={categories}
      />

      <CategoryFormModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSuccess={() => {
          loadCategories();
        }}
        category={selectedCategory}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={
          deleteItem?.type === "product"
            ? "Excluir Produto"
            : "Excluir Categoria"
        }
        description={
          deleteItem?.type === "product"
            ? `Tem certeza que deseja excluir o produto "${deleteItem.item.name}"? Esta ação não pode ser desfeita.`
            : `Tem certeza que deseja excluir a categoria "${deleteItem?.item.name}"? Esta ação não pode ser desfeita.`
        }
      />
    </div>
  );
}
