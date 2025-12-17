<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function wind()
    {
        return Inertia::render('Dashboard/Wind');
    }

    public function temp()
    {
        return Inertia::render('Dashboard/Temperature');
    }
}
