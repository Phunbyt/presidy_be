import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model,Types } from 'mongoose';
import { ModeratorPlan } from 'src/schemas/moderator-plan.schema';
import { Plan } from 'src/schemas/plan.schema';
import { UserType } from 'src/common/constants/types';
import { UpdatePasswordDto } from '../auth/dto/signup.dto';
import { hashDataWithBycrypt } from 'src/common/helpers/bycrypt.helper';
//import { MailService } from '../mail/mail.service';
import { UserPlan } from 'src/schemas/user-plan.schema';
import { FilterUserDto } from './dto/filter-user.dto';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
      @InjectModel('ModeratorPlan') private readonly ModeratorModel: Model<ModeratorPlan>,
            @InjectModel('Plan') private readonly PlanModel: Model<Plan>,
            @InjectModel('UserPlan') private readonly UserPlanModel: Model<UserPlan>
     
) {}
  
  public async create(createUserDto: CreateUserDto) {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      country,
      isVerified = false,
    } = createUserDto;

    const user = await this.userModel.create({
      firstName,
      lastName,
      username,
      country,
      email,
      password,
      isVerified,
    });

    return user;
  }

  async findUserByEmail({ email }) {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto, currentUser: UserType) {
    const {
      firstName,
      lastName,
      username,
      isVerified,
      isModerator,
     // phoneNumber,
    } = updateUserDto;
    const { email } = currentUser;

    const user = await this.findUserByEmail({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const update = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      username: username || user.username,
      isVerified: isVerified || user.isVerified,
      isModerator: isModerator || user.isModerator,
      // phoneNumber: phoneNumber || user.phoneNumber,
    };

    await this.userModel.findOneAndUpdate({ email }, { $set: update }, { new: true });

    return 'user updated successfully';
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    currentUser: UserType,
  ) {
    const { password } = updatePasswordDto;
    const { email } = currentUser;

    const user = await this.findUserByEmail({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const hashedPassword = await hashDataWithBycrypt(password);

    const update = {
      password: hashedPassword || user.password,
    };

    await this.userModel.findOneAndUpdate({ email }, { $set: update }, { new: true });

    return user;
  }

  async findUserById(id: string) {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  // For the Admin Dashboard

  
async getUsers(filter: FilterUserDto) {
    const { search, status, isModerator, isOffline, country, planId, moderatorId, page = 1, limit = 20 } = filter;

    const query: any = {};

    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName:  { $regex: search, $options: 'i' } },
            { email:     { $regex: search, $options: 'i' } },
            { username:  { $regex: search, $options: 'i' } },
        ];
    }

    if (isModerator !== undefined) query.isModerator = isModerator;
    if (isOffline !== undefined)   query.isOffline = isOffline;
    if (country) query.country = country;

    // single source of truth: every ModeratorPlan, used for status, plan, AND family lookup
    const allModeratorPlans = await this.ModeratorModel
        .find()
        .select('user users planId')
        .populate('user', 'firstName lastName email phoneNumber')
        .populate('planId', 'name logoUrl')
        .lean();

    const modPlanByModeratorId = new Map(
        allModeratorPlans.map((mp: any) => [
            (mp.user._id ? mp.user._id.toString() : mp.user.toString()),
            mp,
        ])
    );

    // moderators who manage a plan
    const managingModeratorIds = new Set(
        allModeratorPlans
            .filter((mp: any) => mp.planId)
            .map((mp: any) => (mp.user._id ? mp.user._id.toString() : mp.user.toString()))
    );

    // anyone who's a member of any moderator's family
    const familyMemberIds = new Set(
        allModeratorPlans.flatMap((mp: any) => (mp.users ?? []).map((u: any) => u.toString()))
    );

    const activeUserIds = new Set([...managingModeratorIds, ...familyMemberIds]);

    // ----- ID-narrowing filters -----
    const idFilters: string[][] = [];

    if (status === 'active') {
        idFilters.push(Array.from(activeUserIds));
    }
    if (status === 'inactive') {
        query._id = { ...(query._id ?? {}), $nin: Array.from(activeUserIds) };
    }

    if (planId) {
        const idsManagingPlan = allModeratorPlans
            .filter((mp: any) => mp.planId?._id?.toString() === planId)
            .map((mp: any) => (mp.user._id ? mp.user._id.toString() : mp.user.toString()));

        const idsInFamilyForPlan = allModeratorPlans
            .filter((mp: any) => mp.planId?._id?.toString() === planId)
            .flatMap((mp: any) => (mp.users ?? []).map((u: any) => u.toString()));

        idFilters.push([...new Set([...idsManagingPlan, ...idsInFamilyForPlan])]);
    }

    if (moderatorId) {
        const modPlan = allModeratorPlans.find((mp: any) =>
            (mp.user._id ? mp.user._id.toString() : mp.user.toString()) === moderatorId
        );
        idFilters.push((modPlan?.users ?? []).map((u: any) => u.toString()));
    }

    if (idFilters.length > 0) {
        let intersected = idFilters[0];
        for (let i = 1; i < idFilters.length; i++) {
            const set = new Set(idFilters[i]);
            intersected = intersected.filter((id) => set.has(id));
        }
        query._id = { ...(query._id ?? {}), $in: intersected };
    }

    const skip = (page - 1) * limit;
    const total = await this.userModel.countDocuments(query);

    const users = await this.userModel
        .find(query)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

    const enriched = users.map((user) => {
        const idStr = user._id.toString();

        const familyPlan = allModeratorPlans.find((mp: any) =>
            (mp.users ?? []).some((u: any) => u.toString() === idStr)
        );

        const plan = user.isModerator
            ? (modPlanByModeratorId.get(idStr)?.planId ?? null)
            : (familyPlan?.planId ?? null);

        return {
            ...user.toObject(),
            isActive: activeUserIds.has(idStr),
            plan,
            moderator: user.isModerator ? null : (familyPlan?.user ?? null),
        };
    });

    return {
        data: enriched,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}
async getUser(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('This user does not exist');

    if (user.isModerator) {
        const ownModeratorPlan = await this.ModeratorModel
            .findOne({ user: new Types.ObjectId(id) } as any)
            .populate('planId', 'name logoUrl');

        return {
            user,
            moderator: null,
            plan: ownModeratorPlan?.planId ?? null,
            isActive: !!ownModeratorPlan?.planId,
        };
    }

    const moderatorPlan = await this.ModeratorModel
        .findOne({ users: { $in: [new Types.ObjectId(id)] } } as any)
        .populate('user', 'firstName lastName email phoneNumber')
        .populate('planId', 'name logoUrl');

    return {
        user,
        moderator: moderatorPlan?.user ?? null,
        plan: moderatorPlan?.planId ?? null,
        isActive: !!moderatorPlan,
    };
}

async getUserStats() {
    const total = await this.userModel.countDocuments();
    const offline = await this.userModel.countDocuments({ isOffline: true });

    const allModeratorPlans = await this.ModeratorModel
        .find()
        .select('user users planId')
        .lean();

    const managingModeratorIds = new Set(
        allModeratorPlans
            .filter((mp: any) => mp.planId)
            .map((mp: any) => mp.user.toString())
    );

    const familyMemberIds = new Set(
        allModeratorPlans.flatMap((mp: any) => (mp.users ?? []).map((u: any) => u.toString()))
    );

    const activeUserIds = new Set([...managingModeratorIds, ...familyMemberIds]);

    const active   = activeUserIds.size;
    const inactive = total - active;

    return { total, active, inactive, offline };
}
}
