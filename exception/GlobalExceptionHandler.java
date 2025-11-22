package javaSpring.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javaSpring.dto.request.APIResponse;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(value= Exception.class)
    ResponseEntity<APIResponse> handlingRuntimeException(RuntimeException exception){
        APIResponse apiResponse = new APIResponse<>();

        apiResponse.setCode(ErrorCode.UNCATEGORIZE_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZE_EXCEPTION.getMessage());
        
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value= AppException.class)
    ResponseEntity<APIResponse> handlingAppException(AppException exception){
        ErrorCode errorCode = exception.getErrorCode();
        APIResponse apiResponse = new APIResponse<>();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value= MethodArgumentNotValidException.class)
    ResponseEntity<APIResponse> handlingRuntimeException(MethodArgumentNotValidException exception){
        String enumkey = exception.getFieldError().getDefaultMessage();  //message
        ErrorCode errorCode = ErrorCode.INVALID_KEY;

        try {
            errorCode = ErrorCode.valueOf(enumkey); 
        } catch (IllegalArgumentException e) { //nếu ghi sai message enumkey => log lỗi

        }
        


        APIResponse apiResponse = new APIResponse<>();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        
        return ResponseEntity.badRequest().body(apiResponse);
    }
}
