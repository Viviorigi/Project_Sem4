package com.bkap.techshop.dto.response;

import lombok.*;

import java.util.Date;

@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;

    private String username;

    private String fullName;

    private String email;

    private String phone;

    private String address;

    private Date birthday;

    private Date createdAt;

    private Date updatedAt;

    private boolean status;
}
