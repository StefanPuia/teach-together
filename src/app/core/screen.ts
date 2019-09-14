import { Screen as FrameworkScreen } from '../../framework/core/screen';
import { RenderModifier } from '../../framework/utils/render.util';
import { Request, Response } from 'express';
import dateFormat from 'dateformat';

export class Screen extends FrameworkScreen {
    protected constructor(viewName: string, req: Request, res: Response, errorHandler?: Function,
            context?: GenericObject, status?: number, beforeRender?: RenderModifier,
            afterRender?: RenderModifier) {
        super(viewName, req, res, errorHandler, context, status, beforeRender, afterRender);

        this.contextObject.dateFormat = dateFormat;
    }

    public static create(viewName: string, req: Request, res: Response, context?: GenericObject, status?: number): Screen {
        return new Screen(viewName, req, res, undefined, context, status);
    }
}