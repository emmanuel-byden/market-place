/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { db } from "./Firebase";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore"

const Products = () => {

    
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({name: "", price: ""});
    const [editProduct, setEditProduct] = useState(null)
    const [editDetails, setEditDetails] = useState({name: "", price: ""});

    const productsCollection = collection(db, "products");

    const fetchProducts = async () => {
        const data = await getDocs(productsCollection);
        setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id})));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    
    const addProduct = async () => {
        try {
            if (!newProduct.name || !newProduct.price) return;
            await addDoc(productsCollection, newProduct);
            setNewProduct({ name: "", price: ""});
            fetchProducts();
        } catch (error) {
            console.error("Error adding product: ", error.message);
          }
        
    };

    const updateProduct = async (id) => {
        const productDoc = doc(db, "products", id)
        await updateDoc(productDoc, editDetails);
        setEditProduct(null)
        fetchProducts();
    };

    const deleteProduct = async (id) => {
        const productDoc = doc(db, "products", id);
        await deleteDoc(productDoc);
        fetchProducts();
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Market Place Product Management</h1>
            <div className="mb-4">
                <input 
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value})
                    }
                    className="border p-2 mr-2"
                />
                <input 
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value})
                    }
                    className="border p-2 mr-2"
                />
                <button onClick={addProduct} className="bg-blue-500 text-white p-2">
                    Add Product
                </button>
            </div>
            <ul>
                {products.map((product) =>(
                    <li key={product.id} className="flex items-center mb-2">
                       {editProduct === product.id ? (
                        <div>
                            <input 
                                type="text" 
                                value={editDetails.name}
                                onChange={(e) =>
                                    setEditDetails({ ...editDetails, name: e.target.value})
                                }
                                className="border p-2 mr-2"
                            />
                            <input 
                                type="number" 
                                value={editDetails.price}
                                onChange={(e) =>
                                    setEditDetails({ ...editDetails, price: e.target.value})
                                }
                                className="border p-2 mr-2"
                            />
                            <button 
                                onClick={() => updateProduct(product.id)}
                                className="bg-green-500 text-white p-2 mr-2"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditProduct(null)}
                                className="bg-gray-500 text-white p-2"
                            >
                                Cancel
                            </button>
                        </div>
                       ) : (
                        <>
                            <span className="mr-4">
                                {product.name} - ${product.price}
                            </span>
                            <button
                                onClick={() => {
                                    setEditProduct(product.id);
                                    setEditDetails({
                                        name: product.name,
                                        price: product.price,
                                    });
                                }} 
                                className="bg-yellow-500 text-white p-2 mr-2"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => deleteProduct(product.id)}
                                className="bg-red-500 text-white p-2"
                            >
                                Delete
                            </button>
                        </>
                        
                       )} 
                    </li>
                ))}
            </ul>
        </div>
    );

};


export default Products;