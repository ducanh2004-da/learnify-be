import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MindmapService } from './mindmap.service';
import { MindMapResponse } from '@/common/model/DTO/mindmap/mindmapResponse.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from '@/common/guards/auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CreateMindMapInput, UpdateMindMapInput } from '@/common/model/DTO/mindmap/mindmap.input';
import { MindMapReturn } from '@/common/model/DTO/mindmap/mindmapReturn';
import { NodeReturn } from '@/common/model/DTO/mindmap/nodeReturn';
import { CreateNodeInput, UpdateNodeInput } from '@/common/model/DTO/mindmap/node.input';
import { NodeResponse } from '@/common/model/DTO/mindmap/nodeResponse.dto';

@Resolver(() => MindMapResponse)
export class MindmapResolver {
    constructor(private readonly mindmapService: MindmapService) { }

    @Query(() => MindMapResponse, { nullable: true })
    async getMindMapByCourse(
        @Args('courseId', { type: () => String }) courseId: string
    ): Promise<MindMapResponse | null> {
        const mindmap = await this.mindmapService.getMindMapByCourse(courseId);
        return mindmap ?? null;
    }

    @Mutation(() => MindMapReturn)
    async createMindMap(
        @Args('data') data: CreateMindMapInput
    ): Promise<MindMapReturn> {
        try {
            const created = await this.mindmapService.createMindMap(data);

            if (!created) {
                return {
                    message: 'Tạo không thành công',
                    data: null, // MindMapResponse | null
                };
            }

            return {
                message: 'Tạo thành công',
                data: created, // đảm bảo created có type MindMapResponse
            };
        } catch (error) {
            // (tuỳ bạn) log error ở đây
            return {
                message: 'Có lỗi khi tạo mindmap',
                data: null,
            };
        }
    }

    @Mutation(() => MindMapReturn)
    async updateMindMap(@Args('id', { type: () => String }) id: string, @Args('data') data: UpdateMindMapInput): Promise<MindMapReturn> {
        try {
            const updateRC = await this.mindmapService.updateMindMap(id, data);
            if (!updateRC) {
                return {
                    message: "Cap nhat khong thanh cong",
                    data: null
                }
            }
            return {
                message: "Cap nhat thanh cong",
                data: updateRC
            }
        } catch (err) {
            return {
                message: "Xay ra loi khi cap nhat mindmap",
                data: null
            }
        }
    }

    @Mutation(() => MindMapReturn)
    async deleteMindMap(@Args('id', { type: () => String }) id: string): Promise<MindMapReturn> {
        try {
            const deleteRC = await this.mindmapService.deleteMindMap(id);
            if (!deleteRC) {
                return {
                    message: "Xoa khong thanh cong",
                    data: null
                }
            }
            return {
                message: "Xoa thanh cong",
                data: deleteRC
            }
        } catch (err) {
            return {
                message: "Xay ra loi khi xoa mindmap",
                data: null
            }
        }
    }

    @Mutation(() => NodeReturn)
    async createNode(
        @Args('data') data: CreateNodeInput
    ): Promise<NodeReturn> {
        try {
            const created = await this.mindmapService.createNode(data);

            if (!created) {
                return {
                    message: 'Tạo không thành công',
                    data: null, // MindMapResponse | null
                };
            }

            return {
                message: 'Tạo thành công',
                data: created, // đảm bảo created có type MindMapResponse
            };
        } catch (error) {
            // (tuỳ bạn) log error ở đây
            return {
                message: 'Có lỗi khi tạo mindmap',
                data: null,
            };
        }
    }

    @Query(() => NodeResponse, { nullable: true })
    async getNodeById(
        @Args('id', { type: () => String }) id: string
    ): Promise<NodeResponse | null> {
        const node = await this.mindmapService.getNodeById(id);
        return node ?? null;
    }

    @Mutation(() => NodeReturn)
    async updateNode(@Args('id', { type: () => String }) id: string, @Args('data') data: UpdateNodeInput): Promise<NodeReturn> {
        try {
            const updateRC = await this.mindmapService.updateNode(id, data);
            if (!updateRC) {
                return {
                    message: "Cap nhat khong thanh cong",
                    data: null
                }
            }
            return {
                message: "Cap nhat thanh cong",
                data: updateRC
            }
        } catch (err) {
            return {
                message: "Xay ra loi khi cap nhat mindmap",
                data: null
            }
        }
    }

    @Mutation(() => NodeReturn)
    async deleteNode(@Args('id', { type: () => String }) id: string): Promise<NodeReturn> {
        try {
            const deleteRC = await this.mindmapService.deleteNode(id);
            if (!deleteRC) {
                return {
                    message: "Xoa khong thanh cong",
                    data: null
                }
            }
            return {
                message: "Xoa thanh cong",
                data: deleteRC
            }
        } catch (err) {
            return {
                message: "Xay ra loi khi xoa mindmap",
                data: null
            }
        }
    }

    @Query(() => [NodeResponse], { nullable: true })
    async getAllNodeMindMap(
        @Args('mindmapId', { type: () => String }) mindmapId: string
    ): Promise<NodeResponse[] | null> {
        const mindmap = await this.mindmapService.getAllNodeMindMap(mindmapId);
        return mindmap ?? null;
    }

}
