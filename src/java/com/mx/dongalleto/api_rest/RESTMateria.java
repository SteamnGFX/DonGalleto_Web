/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mx.dongalleto.api_rest;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.mx.dongalleto.core.ControladorGalletas;
import com.mx.dongalleto.core.ControladorMateria;
import com.mx.dongalleto.modelo.Galleta;
import com.mx.dongalleto.modelo.Materia;
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

@Path("materia")
    
public class RESTMateria {
    
    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllMaterias(@QueryParam("filtro") @DefaultValue("") String filtro,
            @QueryParam("fase") @DefaultValue("") String fase) {
        String out = null;
        ControladorMateria ctrMateria = null;
        List<Materia> materias = null;

        try {
            ctrMateria = new ControladorMateria();
            materias = ctrMateria.getAll(filtro);
            out = new Gson().toJson(materias);
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
    public Response save(@FormParam("datosMateria") @DefaultValue("") String datosMateria) throws Exception {
        String out = null;
        Gson gson = new Gson();
        Materia materia = null;
        ControladorMateria ctrMateria = new ControladorMateria();

        try {
            //Convertimos los datos empleado a Json con ayuda de Gson
            materia = gson.fromJson(datosMateria, Materia.class);
            System.out.println(datosMateria + "Son las materias");
            System.out.println(materia.getId() + "Son las materias");
            //Si el id de la materia no existe lo añadimos, si ya existe lo actualizamos
            if (materia.getId()== 0) {
                ctrMateria.insert(materia);
            } else {
                ctrMateria.update(materia);
            }
            out = gson.toJson(materia);
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
    public Response delete(@FormParam("datosMateria") @DefaultValue("") String datosMateria) throws Exception {
        String out = null;
        Gson gson = new Gson();
        Materia materia = null;
        ControladorMateria ctrMateria = new ControladorMateria();

        try {
            //Convertimos los datos empleado a Json con ayuda de Gson
            materia = gson.fromJson(datosMateria, Materia.class);

            ctrMateria.delete(materia.getId());

            out = gson.toJson(materia);
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
