<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PersonController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8'],
            'is_admin' => ['required', 'boolean'],
        ]);

        User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            // si tienes cast 'password' => 'hashed', puedes poner $data['password']
            'password' => $data['password'],
            'is_admin' => $data['is_admin'],
        ]);

        return back()->with('success', 'Persona agregada correctamente.');
    }
}
