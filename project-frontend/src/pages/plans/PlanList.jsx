import React, { useEffect, useState } from 'react';
import { planService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PaymentButton from '../../components/PaymentButton';


const PlanList = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await planService.getPlans();
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg font-medium text-gray-600">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Choose Your Perfect Plan</h2>
        <p className="mt-4 text-lg text-gray-600">Select a plan that best suits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan._id}
            className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <CardHeader className="pb-0 pt-6 px-6">
              <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                  <span className="ml-2 text-gray-500">/month</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {user && user.role !== 'admin' && (
                  
                  <PaymentButton amount={plan.price} planId ={plan._id}/>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanList;


