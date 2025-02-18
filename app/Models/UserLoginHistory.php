<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLoginHistory extends Model
{
    protected $table = 'user_login_history';

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'login_at',
        'login_type',
        'is_successful'
    ];

    protected $casts = [
        'login_at' => 'datetime',
        'is_successful' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

