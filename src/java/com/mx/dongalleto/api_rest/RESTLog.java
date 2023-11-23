package com.mx.dongalleto.api_rest;

import com.google.gson.Gson;
import com.mx.dongalleto.core.ControladorUsuario;
import com.mx.dongalleto.modelo.Usuario;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Angel Roberto Martinez Castro
 * @date 22/11/2023
 * @company CODE ING  ®
 *
 */
@Path("log")
public class RESTLog {

    @POST
    @Path("in")
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@FormParam("credenciales") @DefaultValue("") String credenciales) {
        String out = null;
        Usuario user = null;

        Gson gson = new Gson();

        ControladorUsuario ctrUsuario = new ControladorUsuario();

        try {

            user = gson.fromJson(credenciales, Usuario.class);

            user = ctrUsuario.login(user.getNombre_usuario(), user.getContrasenia());
            
            if (user != null) {
                        out = new Gson().toJson(user);
            } else {
                 out = """
                      {"error":"Usuario/contraseña no son válidos!"}
                      """;
            }

        } catch (Exception ex) {
            Logger.getLogger(RESTLog.class.getName()).log(Level.SEVERE, null, ex);
            out = "{\"exception\":\"Error del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
}
