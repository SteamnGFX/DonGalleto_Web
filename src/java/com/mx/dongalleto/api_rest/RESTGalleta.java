package com.mx.dongalleto.api_rest;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.mx.dongalleto.core.ControladorGalletas;
import com.mx.dongalleto.modelo.Galleta;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 *
 * @author Angel Roberto Martinez Castro
 * @date 22/11/2023
 * @company CODE ING  ®
 *
 */
@Path("galleta")
public class RESTGalleta {
    
    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllGalletas(@QueryParam("filtro") @DefaultValue("") String filtro,
            @QueryParam("fase") @DefaultValue("") String fase) {
        String out = null;
        ControladorGalletas ctrGalletas = null;
        List<Galleta> galletas = null;

        try {
            ctrGalletas = new ControladorGalletas();
            galletas = ctrGalletas.getAll(filtro);
            out = new Gson().toJson(galletas);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error Interno del servidor.\"}";
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    @Path("save")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    //El FormParam a diferencia del QueryParam, no hace una consulta si no que los extrae de un Formulario si asi se desea
    public Response save(@FormParam("datosGalleta") @DefaultValue("") String datosGalleta) throws Exception {
        String out = null;
        Gson gson = new Gson();
        Galleta galleta = null;
        ControladorGalletas ctrGalleta = new ControladorGalletas();

        try {
            //Convertimos los datos empleado a Json con ayuda de Gson
            galleta = gson.fromJson(datosGalleta, Galleta.class);

            //Si el id del empleado no existe lo añadimos, si ya existe lo actualizamos
            if (galleta.getIdGalleta()== 0) {
                ctrGalleta.insert(galleta);
            } else {
                ctrGalleta.update(galleta);
            }
            out = gson.toJson(galleta);
        } catch (JsonParseException jpe) {
            jpe.printStackTrace();
            out = """
                    {"exception":"%s"}
                  """;
            out = String.format(out, jpe.toString());
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"exception":"%s"}
                  """;
            out = String.format(out, e.toString());
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    @Path("delete")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    //El FormParam a diferencia del QueryParam, no hace una consulta si no que los extrae de un Formulario si asi se desea
    public Response delete(@FormParam("datosGalleta") @DefaultValue("") String datosGalleta) throws Exception {
        String out = null;
        Gson gson = new Gson();
        Galleta g = null;
        ControladorGalletas ctrGalleta = new ControladorGalletas();

        try {
            //Convertimos los datos empleado a Json con ayuda de Gson
            g = gson.fromJson(datosGalleta, Galleta.class);

            ctrGalleta.delete(g.getIdGalleta());

            out = gson.toJson(g);
        } catch (JsonParseException jpe) {
            jpe.printStackTrace();
            out = """
                    {"exception":"%s"}
                  """;
            out = String.format(out, jpe.toString());
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"exception":"%s"}
                  """;
            out = String.format(out, e.toString());
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
}
