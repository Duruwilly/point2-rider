export interface Orders {
    package_name: string,
    pickup_location: string,
    pickup_location_coordinate: number[],
    delivery_point_location_coordinate: number[],
    package_category: string,
    schedule_date: string | null,
    schedule: string,
    delivery_type: string,
    tracking_id: string | null,
    customer_phone: string,
    recepient_name: string,
    recepient_phone: string,
    pickup_time: string,
    payment_status: string,
    created_at: Date,
    delivery_point_location: string,
    status: string,
    id: string,
    amount: string
}

export interface OrderResponse extends Orders {}