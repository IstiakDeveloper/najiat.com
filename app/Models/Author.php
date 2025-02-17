<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Author extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'bio', 'email', 'birth_date', 'nationality'
    ];

    protected $dates = ['birth_date'];

    // Relationships
    public function books()
    {
        return $this->hasMany(Book::class);
    }
}
