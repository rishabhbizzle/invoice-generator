import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdRemoveCircle } from "react-icons/md";
import { TailSpin } from "react-loader-spinner";
const OrderForm = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const [productData, setProductData] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [order, setOrder] = useState({
    quantity: "",
    description: "",
    dsin: "",
    hsn: "",
    price: "",
    "tax-rate": "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await axios.get(
        "https://invoice-api-production-d5dc.up.railway.app/getProducts"
      );
      console.log(result);
      setProductData(result.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleAddProduct = () => {
    const selectedProduct = productData.find(
      (product) => product.name === order.productName
    );
    if (!selectedProduct) return;
    const newOrder = {
      quantity: order.quantity,
      description: order.productName,
      dsin: selectedProduct.dsin,
      hsn: selectedProduct.hsn,
      price: selectedProduct.mrp,
      "tax-rate": selectedProduct.gst,
    };
    setOrderList([...orderList, newOrder]);
    setOrder({
      quantity: "",
      description: "",
      dsin: "",
      hsn: "",
      price: "",
      "tax-rate": "",
    });
  };

  const handleRemoveProduct = (index) => {
    setOrderList(orderList.filter((order, i) => i !== index));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://invoice-api-production-d5dc.up.railway.app/generateInvoice",
        { orderList }
      );
      // const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${response.data}`;
      // link.href = window.URL.createObjectURL(blob);
      link.download = "invoice.pdf";
      link.click();
      setOrderList([]);
      setLoading(false);
      setMessage(true);
      setTimeout(() => {
        setMessage(false);
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#121212]">
      <div className="max-w-[1050px] w-full h-screen mx-auto  text-white">
        <form>
          <div className="mb-4">
            <label className="block text-[#F17136] font-medium mb-2">
              Product Name
            </label>
            <select
              className="block appearance-none w-full bg-gray-800 border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              name="productName"
              onChange={handleInputChange}
              value={order.productName}
            >
              <option value="">Select a product</option>
              {productData.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-[#F17136] font-medium mb-2">
              Quantity
            </label>
            <input
              className="block appearance-none w-full bg-gray-800 border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              name="quantity"
              onChange={handleInputChange}
              value={order.quantity}
            />
          </div>

          <button
            className="bg-[#F17136] hover:bg-[#e96528] text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleAddProduct}
          >
            Add Product
          </button>
        </form>
        <div>
          {loading && (
            <TailSpin
              height="50"
              width="50"
              color="#F17136"
              ariaLabel="tail-spin"
              wrapperStyle={{
                alignItems: "center",
                justifyContent: "center",
                position: "fixed",
                left: "0px",
                top: "0px",
                width: "100%",
                height: "100%",
                zIndex: "99",
                textAlign: "center",
                background: "none",
                opacity: "0.8",
              }}
              wrapperClass=""
              visible={true}
            />
          )}
        </div>
        <h2 class="text-lg text-gray-400 font-medium text-center mt-10">
          Order Details
        </h2>
        <div class="flex flex-col mt-2">
          <div class="overflow-x-auto">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div class="shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full text-sm text-gray-400">
                  <thead>
                    <tr className="text-sm md:text-lg font-medium text-[#F17136] text-left">
                      <th className="py-2">Product Name</th>
                      <th className="py-2">Quantity</th>
                      <th className="py-2">Price</th>
                      <th className="py-2">GST</th>

                      <th className="py-2">Amount</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderList.map((order, index) => (
                      <tr key={index} className="text-xs md:text-base">
                        <td className="py-2">{order.description}</td>
                        <td className="py-2">{order.quantity} pcs.</td>
                        <td className="py-2">{order.price}</td>
                        <td className="py-2">18%</td>
                        <td className="py-2">
                          {order.quantity * order.price +
                            (18 / 100) * order.quantity * order.price}
                        </td>
                        <td className="py-2">
                          <MdRemoveCircle
                            className="text-red-500 cursor-pointer"
                            size={28}
                            onClick={() => handleRemoveProduct(index)}
                          ></MdRemoveCircle>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center flex-col">
          <p className="text-3xl mt-10 mb-3 font-medium">
            Total:{" ₹ "}
            {orderList.reduce(
              (total, order) =>
                total +
                order.quantity * order.price +
                (18 / 100) * order.quantity * order.price,
              0
            )}
          </p>
          <button
            className="bg-[#F17136] hover:bg-[#e96528] text-white font-medium py-2 px-4  mx-auto rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
          <div className="my-5 text-xl text-white">
            {message && <p>*Thank You for your order!*</p>}
          </div>
        </div>
        <p className="text-gray-500 mx-auto w-full text-center text-xs mt-5 ">
          Made by Rishabh
        </p>
      </div>
    </div>
  );
};

export default OrderForm;
