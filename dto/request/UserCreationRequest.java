package javaSpring.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Size;

public class UserCreationRequest {

    @Size(min= 3, message= "USERNAME_INVALID")  //validation 
    private String username;

    @Size(min= 8, message= "PASSWORD_INVALID")
    private String password;
    private String firstname;
    private String lastname;
    private LocalDate date;

    
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getFirstname() {
        return firstname;
    }
    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }
    public String getLastname() {
        return lastname;
    }
    public void setLastname(String lastname) {
        this.lastname = lastname;
    }
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }

    
}
