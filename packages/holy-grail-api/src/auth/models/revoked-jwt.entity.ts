import { createHash } from "crypto";
import { Column, Entity, getConnection, PrimaryGeneratedColumn } from "typeorm";

// Create entity for storing revoked jwt tokens
@Entity()
export class RevokedJwt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    hashedJWT: string;

    static fromJWT(jwt: string): RevokedJwt {
        const revokedJwt = new RevokedJwt();
        revokedJwt.hashedJWT = RevokedJwt.hashJWT(jwt);
        return revokedJwt;
    }

    private static hashJWT(jwt: string): string {
        return createHash('sha256').update(jwt).digest('hex');
    }

    static findByJWT(jwt: string): Promise<RevokedJwt> {
        return getConnection().getRepository(RevokedJwt).findOne({
            where: {
                hashedJWT: RevokedJwt.hashJWT(jwt)
            }
        });
    }

    static async revokeJWT(jwt: string): Promise<void> {
        await getConnection().getRepository(RevokedJwt).save(RevokedJwt.fromJWT(jwt));
    }

    static async isRevoked(jwt: string): Promise<boolean> {
        return await RevokedJwt.findByJWT(jwt) !== undefined;
    }
}
