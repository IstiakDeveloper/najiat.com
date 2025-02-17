<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->decimal('total_amount', 10, 2);
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);

            $table->enum('status', [
                'pending', 'processing', 'shipped', 'delivered',
                'cancelled', 'refunded'
            ])->default('pending');

            $table->string('shipping_method')->nullable();
            $table->string('payment_method')->nullable();

            $table->text('shipping_address')->nullable();
            $table->text('billing_address')->nullable();

            $table->timestamp('paid_at')->nullable();
            $table->timestamp('shipped_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
