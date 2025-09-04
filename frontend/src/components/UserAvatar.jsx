import React from "react";

const UserAvatar = ({
  user,
  size = 40,                // taille par défaut
  className = "",            // classes supplémentaires
  fallback = "/images/default_avatar.jpg", // image par défaut
}) => {
  if (!user) {
    return (
      <div
        className={`rounded-circle bg-secondary ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      src={user.avatar?.url || fallback}
      alt={user.name || "User Avatar"}
      className={`rounded-circle ${className}`}
      width={size}
      height={size}
      onError={(e) => (e.target.src = fallback)}
    />
  );
};

export default UserAvatar;
