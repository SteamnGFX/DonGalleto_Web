package com.mx.dongalleto.api_rest;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mx.dongalleto.core.ControladorVenta;
import com.mx.dongalleto.modelo.Venta;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.lang.reflect.Type;
import java.util.List;

/**
 *
 * @author Angel Roberto Martinez Castro
 * @date 22/11/2023
 * @company CODE ING ®
 *
 */
@Path("venta")
public class RESTVenta {

    @POST
@Path("save")
@Produces(MediaType.APPLICATION_JSON)
public Response saveVenta(@FormParam("datosVenta") @DefaultValue("") String datosVenta) throws Exception {
    System.out.println("VENTA");
    System.out.println(datosVenta);
    Gson gson = new Gson();

    Type listType = new TypeToken<List<Venta>>(){}.getType();
    List<Venta> ventas = gson.fromJson(datosVenta, listType);

    ControladorVenta ctrVenta = new ControladorVenta();
    String out = "";
    try {
        ctrVenta.insert(ventas);
        out = "{\"message\":\"Ventas insertadas correctamente.\"}";
    } catch (Exception e) {
        e.printStackTrace();
        out = "{\"exception\":\"Error Interno del servidor.\"}";
    }

    return Response.status(Response.Status.OK).entity(out).build();
}

}
