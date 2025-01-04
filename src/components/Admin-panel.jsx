import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Search, UserCircle, Mail, Plus, X, Shield } from "lucide-react";
import { auth } from "../firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { adminService, userService } from "../services/firebaseserivce";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate();
  const db = getFirestore();

  // Check if current user is admin
  // Check if current user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        const isAdmin = await adminService.isAdmin(user.uid);
        if (!isAdmin) {
          setError("Access denied. Admin privileges required.");
          navigate("/");
          return;
        }

        const [users, admins] = await Promise.all([
          userService.getUsers(),
          adminService.getAdmins(),
        ]);

        setUsers(users);
        setAdmins(admins);
        setIsLoading(false);
      } catch (err) {
        console.error("Error checking admin status:", err);
        setError("Error verifying admin access");
        navigate("/");
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const fetchAdmins = async () => {
    try {
      const adminsRef = collection(db, "admins");
      const querySnapshot = await getDocs(adminsRef);

      const adminsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Admins Data:", adminsData);
      setAdmins(adminsData);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to fetch admins");
      setIsLoading(false);
    }
  };

  const addAdmin = async () => {
    try {
      // Find user by email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", newAdminEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No user found with this email address");
        return;
      }

      const user = querySnapshot.docs[0];
      const adminRef = doc(db, "admins", user.id);

      await setDoc(adminRef, {
        email: newAdminEmail,
      });

      setNewAdminEmail("");
      setDialogOpen(false);
      fetchAdmins();
    } catch (err) {
      console.error("Error adding admin:", err);
      setError("Failed to add admin");
    }
  };

  const removeAdmin = async (adminId) => {
    try {
      await deleteDoc(doc(db, "admins", adminId));
      fetchAdmins();
    } catch (err) {
      console.error("Error removing admin:", err);
      setError("Failed to remove admin");
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 px-6 pb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-red-500 text-center">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6 pb-6">
      {/* Admin Management Section */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">
            Admin Access Management
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={addAdmin} className="mt-4 w-full">
                  Add Admin Access
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-500" />
                        {admin.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAdmin(admin.id)}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Remove Access
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Users List Section */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">User Management</CardTitle>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <span className="text-sm text-gray-500">
                Total Users: {users.length}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        <span>Name</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {user.name?.charAt(0).toUpperCase() || "?"}
                            </span>
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            admins.some((admin) => admin.id === user.id)
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {admins.some((admin) => admin.id === user.id)
                            ? "Admin"
                            : "User"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
