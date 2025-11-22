package javaSpring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javaSpring.dto.request.UserCreationRequest;
import javaSpring.dto.request.UserUpdateRequest;
import javaSpring.entity.User;
import javaSpring.exception.AppException;
import javaSpring.exception.ErrorCode;
import javaSpring.repository.UserRepository;

@Service

public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(UserCreationRequest request){
        User user = new User();

        if(userRepository.existsByUsername(request.getUsername())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        user.setUsername(request.getUsername());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setDate(request.getDate());

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    public User updateUser(String userId, UserUpdateRequest request){
        User user= getUser(userId);

        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setDate(request.getDate());

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    public void deleteUser(String userId){
        userRepository.deleteById(userId);
    }

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public User getUser(String id){
        return userRepository.findById(id)
        .orElseThrow(()-> new RuntimeException("User not found"));
    }
}
