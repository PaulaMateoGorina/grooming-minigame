class Profile {
    public avatar: string;
    public username: string;
    public onlineAge: number;
    public realAge: number;

    constructor(avatar: string, username: string, onlineAge: number, realAge: number) {
        this.avatar = avatar;
        this.username = username;
        this.onlineAge = onlineAge;
        this.realAge = realAge;
    }
}

export default Profile;