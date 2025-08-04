"use client"

import { useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { removeFromCart, updateCartItem } from "@/lib/store/slices/cartSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2,
  CreditCard,
  Package
} from "lucide-react"

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const dispatch = useAppDispatch()
  const { cart, loading } = useAppSelector((state) => state.cart)

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateCartItem({ id: itemId, data: { quantity: newQuantity } }))
    }
  }

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromCart(itemId))
  }

  const totalItems = cart?.total_items || 0
  const totalPrice = cart?.total_price || 0

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              {totalItems > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {totalItems}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {!cart || cart.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500">Start shopping to add items to your cart</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <Card key={item.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                          <p className="text-gray-500 text-sm">${item.price}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-bold text-blue-600">${totalPrice}</span>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Button>
              
              <Button variant="outline" className="w-full">
                <Package className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 