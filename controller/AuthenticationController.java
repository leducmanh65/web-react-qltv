package javaSpring.controller;

import java.text.ParseException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nimbusds.jose.JOSEException;

import javaSpring.dto.request.APIResponse;
import javaSpring.dto.request.AuthenticationRequest;
import javaSpring.dto.request.IntrospectRequest;
import javaSpring.response.AuthenticationResponse;
import javaSpring.response.IntrospectResponse;
import javaSpring.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/authentication")
@RequiredArgsConstructor
@Builder
@FieldDefaults(level= AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    
    @PostMapping("/token")
    APIResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        var result= authenticationService.authenticate(request);
        
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setResult(result);
        return apiResponse;

    }

    @PostMapping("/introspect")
    APIResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request){

        var result= authenticationService.introspect(request);
        
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setResult(result);
        return apiResponse;

    }
}
