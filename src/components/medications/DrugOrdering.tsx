
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { useDrugOrders } from '@/hooks/useDrugOrders';
import { useMedications } from '@/hooks/useMedications';

export function DrugOrdering() {
  const { data: orders = [] } = useDrugOrders();
  const { data: medications = [] } = useMedications();
  const [showOrderForm, setShowOrderForm] = useState(false);

  const lowStockMedications = medications.filter(med => 
    (med.stock_count || 0) <= (med.reorder_level || 5)
  );

  const pendingOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'ordered'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ordered': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Low Stock Alerts */}
      {lowStockMedications.length > 0 && (
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-800">Low Stock Alert</h3>
          </div>
          <div className="space-y-2">
            {lowStockMedications.map(med => (
              <div key={med.id} className="flex justify-between items-center bg-white p-3 rounded">
                <div>
                  <span className="font-medium">{med.drug_name}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    Stock: {med.stock_count} (Reorder at: {med.reorder_level})
                  </span>
                </div>
                <Button size="sm" variant="outline">
                  Order Now
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Drug Ordering */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Drug Orders
          </h3>
          <div className="flex items-center gap-3">
            {/* Upcoming Orders Info */}
            {pendingOrders.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span>{pendingOrders.length} pending order{pendingOrders.length > 1 ? 's' : ''}</span>
              </div>
            )}
            {lowStockMedications.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                <AlertTriangle className="w-4 h-4" />
                <span>{lowStockMedications.length} low stock alert{lowStockMedications.length > 1 ? 's' : ''}</span>
              </div>
            )}
            <Button 
              size="sm"
              onClick={() => setShowOrderForm(!showOrderForm)}
              className="bg-caremate-gradient"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>

        {showOrderForm && <OrderForm onClose={() => setShowOrderForm(false)} />}

        {/* Recent Orders */}
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">Order #{order.id.slice(0, 8)}</h4>
                  <p className="text-sm text-gray-600">
                    Quantity: {order.quantity_ordered} • Supplier: {order.supplier}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status || 'pending')}>
                  {order.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Ordered: {new Date(order.order_date).toLocaleDateString()}
                </span>
                {order.expected_delivery && (
                  <span>Expected: {new Date(order.expected_delivery).toLocaleDateString()}</span>
                )}
                {order.cost && (
                  <span>Cost: €{order.cost}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function OrderForm({ onClose }: { onClose: () => void }) {
  const [orderData, setOrderData] = useState({
    medication_id: '',
    quantity_ordered: '',
    supplier: '',
    expected_delivery: '',
    notes: ''
  });

  const { data: medications = [] } = useMedications();

  return (
    <Card className="p-4 mb-4 bg-gray-50">
      <h4 className="font-medium mb-4">New Drug Order</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="medication">Medication</Label>
          <Select value={orderData.medication_id} onValueChange={(value) => 
            setOrderData(prev => ({ ...prev, medication_id: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select medication" />
            </SelectTrigger>
            <SelectContent>
              {medications.map(med => (
                <SelectItem key={med.id} value={med.id}>
                  {med.drug_name} - Stock: {med.stock_count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input 
            id="quantity"
            type="number"
            value={orderData.quantity_ordered}
            onChange={(e) => setOrderData(prev => ({ ...prev, quantity_ordered: e.target.value }))}
            placeholder="Enter quantity"
          />
        </div>

        <div>
          <Label htmlFor="supplier">Supplier</Label>
          <Input 
            id="supplier"
            value={orderData.supplier}
            onChange={(e) => setOrderData(prev => ({ ...prev, supplier: e.target.value }))}
            placeholder="Supplier name"
          />
        </div>

        <div>
          <Label htmlFor="delivery">Expected Delivery</Label>
          <Input 
            id="delivery"
            type="date"
            value={orderData.expected_delivery}
            onChange={(e) => setOrderData(prev => ({ ...prev, expected_delivery: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button className="bg-caremate-gradient">
          Create Order
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}
