// src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LayoutComponent } from './layout/layout.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { authGuard } from '../guards/auth.guard';
import { ReclamacionesComponent } from './pages/reclamaciones/reclamaciones.component';
import { ZapatillasComponent } from './pages/zapatillas/zapatillas.component';
import { VariacionesComponent } from './pages/variaciones/variaciones.component';
import { SugerennciasComponent } from './pages/sugerenncias/sugerenncias.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: LayoutComponent,       // layout (sidebar/topbar)
        children: [
            { path: '', component: InicioComponent, pathMatch: 'full' },
            { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
            { path: 'zapatillas', component: ZapatillasComponent, canActivate: [authGuard], data: { roles: ['INVENTARIO', 'ADMIN'] } },
            { path: 'zapatillas/:id', component: VariacionesComponent, canActivate: [authGuard], data: { roles: ['INVENTARIO', 'ADMIN'] } },
            { path: 'pedidos', component: PedidosComponent, canActivate: [authGuard], data: { roles: ['PEDIDOS', 'ADMIN'] } },
            { path: 'ventas', component: VentasComponent, canActivate: [authGuard], data: { roles: ['VENTAS', 'ADMIN'] } },
            { path: 'reclamaciones', component: ReclamacionesComponent },
            { path: 'sugerencias', component: SugerennciasComponent },
        ]
    }
];
