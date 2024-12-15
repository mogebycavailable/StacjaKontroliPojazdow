package edu.bednarski.skpbackend.domain.dto;


public class JwtTokenDto {

    private String tokenString;

    private String role;

    public JwtTokenDto(String tokenString, String role) {
        this.tokenString = tokenString;
        this.role = role;
    }

    public JwtTokenDto() {
    }

    public static JwtTokenDtoBuilder builder() {
        return new JwtTokenDtoBuilder();
    }

    public String getTokenString() {
        return this.tokenString;
    }

    public String getRole() {
        return this.role;
    }

    public void setTokenString(String tokenString) {
        this.tokenString = tokenString;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof JwtTokenDto)) return false;
        final JwtTokenDto other = (JwtTokenDto) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$tokenString = this.getTokenString();
        final Object other$tokenString = other.getTokenString();
        if (this$tokenString == null ? other$tokenString != null : !this$tokenString.equals(other$tokenString))
            return false;
        final Object this$role = this.getRole();
        final Object other$role = other.getRole();
        if (this$role == null ? other$role != null : !this$role.equals(other$role)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof JwtTokenDto;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $tokenString = this.getTokenString();
        result = result * PRIME + ($tokenString == null ? 43 : $tokenString.hashCode());
        final Object $role = this.getRole();
        result = result * PRIME + ($role == null ? 43 : $role.hashCode());
        return result;
    }

    public String toString() {
        return "JwtTokenDto(tokenString=" + this.getTokenString() + ", role=" + this.getRole() + ")";
    }

    public static class JwtTokenDtoBuilder {
        private String tokenString;
        private String role;

        JwtTokenDtoBuilder() {
        }

        public JwtTokenDtoBuilder tokenString(String tokenString) {
            this.tokenString = tokenString;
            return this;
        }

        public JwtTokenDtoBuilder role(String role) {
            this.role = role;
            return this;
        }

        public JwtTokenDto build() {
            return new JwtTokenDto(this.tokenString, this.role);
        }

        public String toString() {
            return "JwtTokenDto.JwtTokenDtoBuilder(tokenString=" + this.tokenString + ", role=" + this.role + ")";
        }
    }
}
