<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 'order_number', 'total_amount', 'shipping_cost',
        'tax_amount', 'status', 'shipping_method', 'payment_method',
        'shipping_address', 'billing_address', 'paid_at', 'shipped_at'
    ];

    protected $dates = ['paid_at', 'shipped_at'];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Generate unique order number
    public static function generateOrderNumber()
    {
        return 'ORD-' . date('Ymd') . '-' . str_pad(self::count() + 1, 5, '0', STR_PAD_LEFT);
    }
}
