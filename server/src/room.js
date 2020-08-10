import { nanoid } from "nanoid";

class Room {
    constructor(socketId) {
        this.id = nanoid(7);
        this.name = "Room " + this.generateName(Room.count);
        this.users = {};
        this.video = {};
        this.action = null;
        Room.count += 1;
        Room.idToRoom[this.id] = this;
        Room.socketIdToRoom[socketId] = this;
    }

    generateName(id) {
        let current = String.fromCharCode(65 + (id % 26));
        if (id >= 26) {
            return this.generateName(Math.floor(id / 26) - 1) + current;
        } else {
            return current;
        }
    }

    leave(socketId) {
        let isEmpty = false;
        let username = this.users[socketId].username;
        delete Room.socketIdToRoom[socketId];
        delete this.users[socketId];
        if (!Object.keys(this.users).length) {
            delete Room.idToRoom[this.id];
            isEmpty = true;
        }
        if (!Object.keys(Room.idToRoom).length) Room.count = 0;
        return { isEmpty, username: username };
    }

    addUser(socketId, username) {
        this.users[socketId] = { username, isBuffering: true };
        Room.socketIdToRoom[socketId] = this;
    }

    setUserState(socketId, key, value) {
        this.users[socketId][key] = value;
    }

    getUser(socketId) {
        return this.users[socketId];
    }

    getUsers() {
        return Object.values(this.users);
    }

    setAction(value) {
        this.action = value;
    }

    update(key, value) {
        this[key] = { ...this[key], ...value };
    }

    loadVideo(url) {
        this.video = { url, isPlaying: true, isBuffering: true };
    }

    removeVideo() {
        this.video = {};
    }

    isVideoBuffering() {
        return Object.values(this.users).some((user) => user.isBuffering);
    }

    static getRoomById(id) {
        return this.idToRoom[id];
    }

    static getRoomBySocketId(id) {
        return this.socketIdToRoom[id];
    }

    static getRooms() {
        return Object.values(this.idToRoom).map((room) => ({
            name: room.name,
            id: room.id,
            users: Object.keys(room.users).length,
            status: room.video,
        }));
    }
}

Room.count = 0;
Room.idToRoom = {};
Room.socketIdToRoom = {};

export default Room;
