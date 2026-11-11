"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[168],{3168:(e,t,i)=>{let n,s;i.r(t),i.d(t,{default:()=>W});var r=i(5060),a=i(1736),o=i(673),l=i(50),d=i(3291),c=i(7625),f=i(2543),u=i(3508);let p=new u.NRn,h=new u.Pq0;class m extends u.CmU{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new u.qtW([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new u.qtW([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new u.LuO(t,6,1);return this.setAttribute("instanceStart",new u.eHs(i,3,0)),this.setAttribute("instanceEnd",new u.eHs(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new u.LuO(i,2*t,1);return this.setAttribute("instanceColorStart",new u.eHs(n,t,0)),this.setAttribute("instanceColorEnd",new u.eHs(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new u.XJ7(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new u.NRn);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),p.setFromBufferAttribute(t),this.boundingBox.union(p))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new u.iyt),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let s=0,r=e.count;s<r;s++)h.fromBufferAttribute(e,s),n=Math.max(n,i.distanceToSquared(h)),h.fromBufferAttribute(t,s),n=Math.max(n,i.distanceToSquared(h));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var v=i(4187);let y=parseInt(u.sPf.replace(/\D+/g,""));class g extends u.BKk{constructor(e){super({type:"LineMaterial",uniforms:u.LlO.clone(u.LlO.merge([v.UniformsLib.common,v.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new u.I9Y(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${y>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=y>=125?"uv1":"uv2",w=new u.IUQ,S=new u.Pq0,b=new u.Pq0,E=new u.IUQ,_=new u.IUQ,A=new u.IUQ,L=new u.Pq0,U=new u.kn4,z=new u.cZY,C=new u.Pq0,j=new u.NRn,M=new u.iyt,P=new u.IUQ;function O(e,t,i){return P.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),P.multiplyScalar(1/P.w),P.x=s/i.width,P.y=s/i.height,P.applyMatrix4(e.projectionMatrixInverse),P.multiplyScalar(1/P.w),Math.abs(Math.max(P.x,P.y))}class D extends u.eaF{constructor(e=new m,t=new g({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,s=0,r=t.count;e<r;e++,s+=2)S.fromBufferAttribute(t,e),b.fromBufferAttribute(i,e),n[s]=0===s?0:n[s-1],n[s+1]=n[s]+S.distanceTo(b);let s=new u.LuO(n,2,1);return e.setAttribute("instanceDistanceStart",new u.eHs(s,1,0)),e.setAttribute("instanceDistanceEnd",new u.eHs(s,1,1)),this}raycast(e,t){let i,r,a=this.material.worldUnits,o=e.camera;null!==o||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let l=void 0!==e.params.Line2&&e.params.Line2.threshold||0;n=e.ray;let d=this.matrixWorld,c=this.geometry,f=this.material;if(s=f.linewidth+l,null===c.boundingSphere&&c.computeBoundingSphere(),M.copy(c.boundingSphere).applyMatrix4(d),a)i=.5*s;else{let e=Math.max(o.near,M.distanceToPoint(n.origin));i=O(o,e,f.resolution)}if(M.radius+=i,!1!==n.intersectsSphere(M)){if(null===c.boundingBox&&c.computeBoundingBox(),j.copy(c.boundingBox).applyMatrix4(d),a)r=.5*s;else{let e=Math.max(o.near,j.distanceToPoint(n.origin));r=O(o,e,f.resolution)}j.expandByScalar(r),!1!==n.intersectsBox(j)&&(a?function(e,t){let i=e.matrixWorld,r=e.geometry,a=r.attributes.instanceStart,o=r.attributes.instanceEnd,l=Math.min(r.instanceCount,a.count);for(let r=0;r<l;r++){z.start.fromBufferAttribute(a,r),z.end.fromBufferAttribute(o,r),z.applyMatrix4(i);let l=new u.Pq0,d=new u.Pq0;n.distanceSqToSegment(z.start,z.end,d,l),d.distanceTo(l)<.5*s&&t.push({point:d,pointOnLine:l,distance:n.origin.distanceTo(d),object:e,face:null,faceIndex:r,uv:null,[x]:null})}}(this,t):function(e,t,i){let r=t.projectionMatrix,a=e.material.resolution,o=e.matrixWorld,l=e.geometry,d=l.attributes.instanceStart,c=l.attributes.instanceEnd,f=Math.min(l.instanceCount,d.count),p=-t.near;n.at(1,A),A.w=1,A.applyMatrix4(t.matrixWorldInverse),A.applyMatrix4(r),A.multiplyScalar(1/A.w),A.x*=a.x/2,A.y*=a.y/2,A.z=0,L.copy(A),U.multiplyMatrices(t.matrixWorldInverse,o);for(let t=0;t<f;t++){if(E.fromBufferAttribute(d,t),_.fromBufferAttribute(c,t),E.w=1,_.w=1,E.applyMatrix4(U),_.applyMatrix4(U),E.z>p&&_.z>p)continue;if(E.z>p){let e=E.z-_.z,t=(E.z-p)/e;E.lerp(_,t)}else if(_.z>p){let e=_.z-E.z,t=(_.z-p)/e;_.lerp(E,t)}E.applyMatrix4(r),_.applyMatrix4(r),E.multiplyScalar(1/E.w),_.multiplyScalar(1/_.w),E.x*=a.x/2,E.y*=a.y/2,_.x*=a.x/2,_.y*=a.y/2,z.start.copy(E),z.start.z=0,z.end.copy(_),z.end.z=0;let l=z.closestPointToPointParameter(L,!0);z.at(l,C);let f=u.cj9.lerp(E.z,_.z,l),h=f>=-1&&f<=1,m=L.distanceTo(C)<.5*s;if(h&&m){z.start.fromBufferAttribute(d,t),z.end.fromBufferAttribute(c,t),z.start.applyMatrix4(o),z.end.applyMatrix4(o);let s=new u.Pq0,r=new u.Pq0;n.distanceSqToSegment(z.start,z.end,r,s),i.push({point:r,pointOnLine:s,distance:n.origin.distanceTo(r),object:e,face:null,faceIndex:t,uv:null,[x]:null})}}}(this,o,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(w),this.material.uniforms.resolution.value.set(w.z,w.w))}}class B extends m{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let s=0;s<i;s+=t)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];else for(let s=0;s<i;s+=t)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5],n[2*s+6]=e[s+6],n[2*s+7]=e[s+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class R extends D{constructor(e=new B,t=new g({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let N=a.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:n,lineWidth:s,segments:r,dashed:l,...d},c){var p,h;let v=(0,o.D)(e=>e.size),y=a.useMemo(()=>r?new D:new R,[r]),[x]=a.useState(()=>new g),w=(null==i||null==(p=i[0])?void 0:p.length)===4?4:3,S=a.useMemo(()=>{let n=r?new m:new B,s=e.map(e=>{let t=Array.isArray(e);return e instanceof u.Pq0||e instanceof u.IUQ?[e.x,e.y,e.z]:e instanceof u.I9Y?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(s.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof u.Q1f?e.toArray():e);n.setColors(e.flat(),w)}return n},[e,r,i,w]);return a.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),a.useLayoutEffect(()=>{l?x.defines.USE_DASH="":delete x.defines.USE_DASH,x.needsUpdate=!0},[l,x]),a.useEffect(()=>()=>{S.dispose(),x.dispose()},[S]),a.createElement("primitive",(0,f.A)({object:y,ref:c},d),a.createElement("primitive",{object:S,attach:"geometry"}),a.createElement("primitive",(0,f.A)({object:x,attach:"material",color:t,vertexColors:!!i,resolution:[v.width,v.height],linewidth:null!=(h=null!=n?n:s)?h:1,dashed:l,transparent:4===w},d)))});var H=i(9342);let T=[[-3.1,0,0],[0,0,0],[3.1,0,0]];class I extends a.Component{static getDerivedStateFromError(){return{failed:!0}}render(){return this.state.failed?(0,r.jsx)("p",{className:"flow-fallback",children:"The 3D view is unavailable. Build and connect every section using the controls below."}):this.props.children}constructor(...e){super(...e),this.state={failed:!1}}}function q({failed:e}){let{gl:t}=(0,o.D)();return(0,a.useEffect)(()=>(t.domElement.addEventListener("webglcontextlost",e),()=>t.domElement.removeEventListener("webglcontextlost",e)),[t,e]),null}function k({angle:e,setLabels:t}){let{camera:i,size:n}=(0,o.D)(),s=(0,a.useRef)("");return(0,o.F)(()=>{let r=T.map(t=>{let s=new u.Pq0(t[0],.3,1.2).applyAxisAngle(new u.Pq0(0,1,0),e).project(i);return{x:(.5*s.x+.5)*n.width,y:(-.5*s.y+.5)*n.height}}),a=JSON.stringify(r.map(e=>[Math.round(e.x),Math.round(e.y)]));a!==s.current&&(s.current=a,t(r))}),null}function W({state:e,onConnect:t,selected:i,onSelect:n}){let[s,o]=(0,a.useState)(!1),[f,u]=(0,a.useState)(0),[p,h]=(0,a.useState)([]),m=(0,a.useCallback)(e=>h(e),[]);return s?(0,r.jsx)("p",{className:"flow-fallback",children:"The 3D view is unavailable. Use the same editable sections and Next Page controls below."}):(0,r.jsx)(I,{children:(0,r.jsxs)("div",{className:"flow-canvas",children:[(0,r.jsxs)(l.Hl,{shadows:!0,dpr:[1,1.5],frameloop:"demand",gl:{antialias:!0,powerPreference:"low-power",preserveDrawingBuffer:!0},children:[(0,r.jsx)(q,{failed:()=>o(!0)}),(0,r.jsx)(d.q,{makeDefault:!0,position:[0,6,8],zoom:43,onUpdate:e=>e.lookAt(0,0,0)}),(0,r.jsx)(k,{angle:f,setLabels:m}),(0,r.jsx)("ambientLight",{intensity:1.2}),(0,r.jsx)("directionalLight",{position:[-4,8,5],intensity:2,castShadow:!0}),(0,r.jsxs)("group",{rotation:[0,f,0],children:[e.pages.map((e,s)=>(0,r.jsxs)("group",{position:T[s],onClick:s=>{s.stopPropagation(),i&&i!==e.id?t(i,e.id):n(e.id)},children:[(0,r.jsx)(c.b,{args:[2,.3,1.5],radius:.12,castShadow:!0,children:(0,r.jsx)("meshStandardMaterial",{color:i===e.id?"#d7ac57":"End"===e.type?"#6e488a":"#805d9c",roughness:.45})}),[0,1,2].map(e=>(0,r.jsxs)("mesh",{position:[-.4,.18,-.3+.28*e],rotation:[-Math.PI/2,0,0],children:[(0,r.jsx)("planeGeometry",{args:[1.1,.045]}),(0,r.jsx)("meshStandardMaterial",{color:"#ede0f8"})]},e))]},e.id)),e.pages.flatMap((t,i)=>{let n=e.pages.findIndex(e=>e.id===t.next);return n<0?[]:[(0,r.jsx)(N,{points:[[T[i][0]+1,.15,0],[T[n][0]-1,.15,0]],color:"#c18c36",lineWidth:3},t.id)]}),(0,r.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.25,0],receiveShadow:!0,children:[(0,r.jsx)("planeGeometry",{args:[22,12]}),(0,r.jsx)("meshStandardMaterial",{color:"#e7e2ed"})]})]}),(0,r.jsx)(H.N,{enablePan:!1,enableZoom:!1,minPolarAngle:.3,maxPolarAngle:1.3})]}),(0,r.jsx)("div",{className:"flow-node-labels",children:e.pages.map((e,s)=>(0,r.jsxs)("button",{className:i===e.id?"flow-node-label selected":"flow-node-label",style:{left:p[s]?.x??0,top:p[s]?.y??0},onClick:()=>i&&i!==e.id?t(i,e.id):n(e.id),"aria-pressed":i===e.id,children:[e.type,(0,r.jsx)("strong",{children:e.title}),(0,r.jsx)("small",{children:i===e.id?"Choose a destination":"Select to connect"})]},e.id))}),e.pages.length?null:(0,r.jsx)("div",{className:"flow-empty",children:"Your sections will appear here as you build."}),(0,r.jsxs)("div",{className:"flow-view-controls",children:[(0,r.jsx)("button",{onClick:()=>u(e=>e-.25),"aria-label":"Rotate flow left",children:"Rotate left"}),(0,r.jsx)("button",{onClick:()=>u(e=>e+.25),"aria-label":"Rotate flow right",children:"Rotate right"}),(0,r.jsx)("button",{onClick:()=>u(0),children:"Reset view"})]})]})})}}}]);